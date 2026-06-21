import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { TokenDb, TokenRecord } from './server/tokenDb';
import {
  exchangeCodeForTokens,
  fetchGoogleProfile,
  getValidAccessToken,
  fetchSpreadsheetData,
  sendGmailMessage,
  getClientCredentials
} from './server/googleApis';

import fs from 'fs';

// Initialize Firebase Admin SDK
if (getApps().length === 0) {
  try {
    const firebaseConfigPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));
    
    initializeApp({
      projectId: firebaseConfig.projectId
    });
    console.log('[Firebase Admin] Initialized successfully with project:', firebaseConfig.projectId);
  } catch (err) {
    console.error('[Firebase Admin] Initialization failed:', err);
  }
}

// Firebase Token Verification Middleware (Zero-Trust protection)
async function authenticateUser(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Please login to continue.' });
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error: any) {
    console.error('[Auth Error] Firebase verification failed:', error.message);
    return res.status(401).json({ error: 'Session expired or unauthenticated. Please login again.' });
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for parsing requests
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Helper to construct dynamic OAuth redirect URI
  function getRedirectUri(req: express.Request) {
    const host = (req.headers['x-forwarded-host'] || req.headers.host) as string;
    const protocol = (req.headers['x-forwarded-proto'] || 'https') as string;
    
    // Check if we are running in localhost dev or within AI Studio secure container
    if (host && (host.includes('.run.app') || host.includes('localhost'))) {
      return `${host.includes('localhost') ? 'http' : protocol}://${host}/api/auth/google/callback`;
    }
    
    if (process.env.APP_URL) {
      return `${process.env.APP_URL.replace(/\/$/, '')}/api/auth/google/callback`;
    }
    
    return `http://localhost:${PORT}/api/auth/google/callback`;
  }

  // --- OAUTH ENDPOINTS ---

  /**
   * Generates Google Consent screen URL
   * Fully protected: requires Bearer Firebase token from user to bind OAuth
   */
  app.get('/api/auth/google/url', authenticateUser, (req, res) => {
    const { type } = req.query; // 'gmail' or 'sheets'
    const userId = (req as any).user.uid;
    const redirectUri = getRedirectUri(req);
    const providerAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ];

    if (type === 'gmail') {
      scopes.push(
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.readonly'
      );
    } else if (type === 'sheets') {
      scopes.push(
        'https://www.googleapis.com/auth/spreadsheets.readonly',
        'https://www.googleapis.com/auth/drive.readonly'
      );
    } else {
      return res.status(400).json({ error: 'Invalid channel type specified' });
    }

    const { clientId } = getClientCredentials();
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      access_type: 'offline', // Absolute mandatory to acquire a Refresh Token
      prompt: 'consent',     // Forces consent confirmation to guarantee fresh refresh token
      state: `${type}:${userId}`, // Securely bind connection request to active Firebase user partition
    });

    res.json({ url: `${providerAuthUrl}?${params.toString()}` });
  });

  /**
   * Handle dynamic OAuth codes callback from Google Identity Server
   * Extracts user mapping from 'state' parameter to persist credentials securely
   */
  app.get(['/api/auth/google/callback', '/api/auth/google/callback/'], async (req, res) => {
    const { code, state } = req.query; 
    const redirectUri = getRedirectUri(req);

    if (!code) {
      return res.status(400).send('Authorization code is missing from callback URL.');
    }

    let type = 'gmail';
    let userId = 'default_user';
    if (state) {
      const parts = (state as string).split(':');
      type = parts[0];
      if (parts.length > 1) {
        userId = parts[1];
      }
    }

    try {
      // 1. Exchange authorization code for secure access + refresh token payload
      const tokens = await exchangeCodeForTokens(code as string, redirectUri);
      
      // 2. Fetch authenticated user's email identification
      const profile = await fetchGoogleProfile(tokens.access_token);
      const email = profile.email;
      const name = profile.name || '';
      const picture = profile.picture || '';

      // Preserve existing refresh token if Google decides not to send one on repeat logins
      const existing = TokenDb.get(userId, (type as any) || 'gmail', email);
      const finalRefreshToken = tokens.refresh_token || (existing ? existing.refresh_token : null);

      // 3. Stash payload inside local encrypted store record partitioned by secure userId
      TokenDb.set(userId, (type as any) || 'gmail', email, {
        userId,
        email,
        name,
        picture,
        type: (type as any) || 'gmail',
        access_token: tokens.access_token,
        refresh_token: finalRefreshToken,
        expires_at: Date.now() + (tokens.expires_in * 1000),
        last_sync: new Date().toISOString()
      });

      // Send beautiful responsive callback confirmation HTML back to secure popup window
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authorization Successful</title>
          <style>
            body {
              background-color: #030305;
              color: #ffffff;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              text-align: center;
            }
            .card {
              background: rgba(10, 10, 15, 0.8);
              border: 1px solid rgba(0, 243, 255, 0.15);
              padding: 3rem;
              border-radius: 2rem;
              box-shadow: 0 0 50px rgba(0, 243, 255, 0.08);
              max-width: 400px;
            }
            .icon {
              width: 64px;
              height: 64px;
              background: rgba(0, 243, 255, 0.1);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 1.5rem auto;
              border: 1px solid rgba(0, 243, 255, 0.4);
            }
            h1 {
              color: #ffffff;
              font-size: 1.8rem;
              margin: 0 0 0.5rem 0;
              font-weight: 700;
              letter-spacing: -0.025em;
            }
            p {
              color: #94a3b8;
              font-size: 0.95rem;
              line-height: 1.5;
              margin: 0 0 1.5rem 0;
            }
            .status {
              display: inline-block;
              font-family: monospace;
              color: #00f3ff;
              font-size: 0.8rem;
              background: rgba(0, 243, 255, 0.05);
              padding: 0.4rem 0.8rem;
              border-radius: 9999px;
              font-weight: bold;
              letter-spacing: 0.05em;
              text-transform: uppercase;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h1>Engine Synchronized</h1>
            <p>Your Google account has been secured under Genzio systems.</p>
            <span class="status">Type: ${type || 'gmail'}</span>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', accountType: '${type}' }, '*');
              setTimeout(() => {
                window.close();
              }, 1200);
            } else {
              window.location.href = '/tool/email-automation';
            }
          </script>
        </body>
        </html>
      `);
    } catch (err: any) {
      console.error('Google authorization callback error:', err);
      res.status(500).send(`
        <html>
        <body style="background-color: #050508; color: #ff5252; padding: 2rem; font-family: sans-serif; text-align: center;">
          <h2>Integration Refused</h2>
          <p>${err.message}</p>
        </body>
        </html>
      `);
    }
  });

  // --- ACCOUNTS ENDPOINTS ---

  /**
   * Acquire active secured accounts lists partitioned specifically for the logged-in user
   */
  app.get('/api/accounts', authenticateUser, (req, res) => {
    const userId = (req as any).user.uid;
    const records = TokenDb.list(userId);
    const accounts = records.map(r => ({
      email: r.email,
      name: r.name,
      picture: r.picture,
      provider: r.type,
      status: 'Connected',
      lastSync: r.last_sync
    }));
    res.json({ accounts });
  });

  /**
   * Sever connection links safely partitioned by user
   */
  app.delete('/api/accounts', authenticateUser, (req, res) => {
    const userId = (req as any).user.uid;
    const { email, provider } = req.query;
    if (!email || !provider) {
      return res.status(400).json({ error: 'Email and provider are required query args' });
    }
    const success = TokenDb.delete(userId, provider as any, email as string);
    res.json({ success });
  });

  // --- GOOGLE SHEETS ENDPOINTS ---

  /**
   * Read Spreadsheet values dynamically via Real Google Workspace Sheet APIs partitioned by user
   */
  app.post('/api/sheets/import', authenticateUser, async (req, res) => {
    const userId = (req as any).user.uid;
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'Please enter a valid Google Sheets URL.' });
    }

    // Extract sheet id using regular expression
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      return res.status(400).json({ error: 'Could not resolve spreadsheet ID from the URL. Ensure the URL starts with https://docs.google.com/spreadsheets/d/...' });
    }
    const spreadsheetId = match[1];

    // Find first authenticated Sheets account owned by this user
    const sheetsRecord = TokenDb.list(userId).find(r => r.type === 'sheets');
    if (!sheetsRecord) {
      return res.status(400).json({
        error: 'No active Google Sheets authorizations detected. Please connect GSheets permissions first.'
      });
    }

    try {
      const accessToken = await getValidAccessToken(userId, 'sheets', sheetsRecord.email);
      const data = await fetchSpreadsheetData(spreadsheetId, accessToken);
      res.json({ success: true, ...data });
    } catch (e: any) {
      console.error('Import spreadsheet failure:', e);
      res.status(500).json({ error: e.message || 'Sheet authorization credentials expired. Re-authenticate and try again.' });
    }
  });

  // --- GMAIL CAMPAIGNS ENDPOINTS ---

  /**
   * Dispatch campaign emails with variables personalization over the Gmail channel partitioned by user
   */
  app.post('/api/campaign/send', authenticateUser, async (req, res) => {
    const userId = (req as any).user.uid;
    const { fromEmail, leads, subject, body } = req.body;

    if (!fromEmail) {
      return res.status(400).json({ error: 'Please select an authorized Gmail account to send from.' });
    }
    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ error: 'Campaign is empty: there are no leads imported.' });
    }
    if (!subject || !body) {
      return res.status(400).json({ error: 'Subject or Email body draft cannot be empty.' });
    }

    try {
      const accessToken = await getValidAccessToken(userId, 'gmail', fromEmail);
      const results: { email: string; status: 'Sent' | 'Failed'; error?: string }[] = [];

      for (const lead of leads) {
        const toEmail = lead.Email || lead.email || lead.EMAIL;
        
        if (!toEmail) {
          results.push({ email: 'Unknown', status: 'Failed', error: 'Missing Email address variable' });
          continue;
        }

        // Simple utility that matches variables e.g {Name} and replaces them with lead value
        const interpolate = (text: string) => {
          return text.replace(/\{([^}]+)\}/g, (match, varName) => {
            const trimmedName = varName.trim();
            // Look up lead's matching keys, ignoring case
            const leadKey = Object.keys(lead).find(k => k.toLowerCase() === trimmedName.toLowerCase());
            if (leadKey && lead[leadKey] !== undefined) {
              return lead[leadKey].toString();
            }
            return match; // Return unchanged variable if missing
          });
        };

        const customSubject = interpolate(subject);
        const customBody = interpolate(body);

        try {
          // Send raw MIME directly through Google REST API
          await sendGmailMessage(fromEmail, toEmail, customSubject, customBody, accessToken);
          results.push({ email: toEmail, status: 'Sent' });
        } catch (err: any) {
          console.error(`Failed sending campaign email to ${toEmail}:`, err);
          results.push({ email: toEmail, status: 'Failed', error: err.message || 'Gmail transmission error' });
        }
      }

      res.json({ success: true, results });
    } catch (e: any) {
      console.error('Campaign sending error:', e);
      res.status(500).json({ error: e.message || 'Could not instantiate campaign sending.' });
    }
  });

  // --- EMAIL VERIFIER ENDPOINT ---

  app.post('/api/email-verifier/verify', authenticateUser, async (req, res) => {
    try {
      const { emails } = req.body;
      if (!emails || !Array.isArray(emails)) {
        return res.status(400).json({ error: 'Invalid payload: emails array required' });
      }

      const { verifyEmail } = await import('./server/emailVerifier');
      const results = [];
      const batchSize = 10;

      // Process in batches so we don't overwhelm DNS queries
      for (let i = 0; i < emails.length; i += batchSize) {
        const batch = emails.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(verifyEmail));
        results.push(...batchResults);
      }

      res.json({ results });
    } catch (err: any) {
      console.error('Email verification error:', err);
      res.status(500).json({ error: 'Verification service error' });
    }
  });

  // --- GENZIO AI CHAT ENDPOINT ---
  
  app.post('/api/chat', authenticateUser, async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Messages array is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
         return res.status(500).json({ error: 'Gemini API Key is not configured on the server.' });
      }

      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const systemInstruction = `You are Genzio AI, a specialized premium AI assistant focused strictly on client acquisition, lead generation, outreach strategies, cold email writing, sales conversations, and agency/business growth. You are part of the Genzio platform (a cold outreach automation tool). If the user asks general questions unrelated to these topics, you MUST politely refuse and clarify that you only assist with client acquisition and outreach workflows. Be concise, highly professional, and actionable. Do not use markdown unless necessary for code or formatting.`;

      // Format messages for the API. The last message is the user prompt.
      // Prior messages are history.
      const transformedContents = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content || m.text || '' }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: transformedContents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ response: response.text });

    } catch (err: any) {
      console.error('AI Chat Error:', err);
      res.status(500).json({ error: 'Failed to generate AI response' });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';

const appPromise = startServer();

const PORT = parseInt(process.env.PORT || '3000', 10);

if (!isVercel) {
  appPromise.then(app => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Genzio Server] listening on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error('Fatal server boot failure:', err);
  });
}

export default appPromise;
