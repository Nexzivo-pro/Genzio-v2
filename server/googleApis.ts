import { TokenDb, TokenRecord } from './tokenDb';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET || '';

// Logs configuration warning
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn('WARNING: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET environment variables are not set. Go to settings in AI Studio to populate them.');
}

export function getClientCredentials() {
  return { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET };
}

/**
 * Exchange Authorization Code for Token
 */
export async function exchangeCodeForTokens(code: string, redirectUri: string) {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Google OAuth credentials are not configured in environment variables.');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }).toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Fetch Google User Info to determine account identity
 */
export async function fetchGoogleProfile(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  return response.json(); // { email, name, picture }
}

/**
 * Refresh an expired access token using its refresh token
 */
export async function refreshGoogleToken(refreshToken: string): Promise<{ access_token: string; expires_in: number }> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Google OAuth credentials are not configured.');
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }).toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token refresh failed: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * Get a valid access token for an account, refreshing if expired
 */
export async function getValidAccessToken(userId: string, type: 'gmail' | 'sheets', email: string): Promise<string> {
  const record = TokenDb.get(userId, type, email);
  if (!record) {
    throw new Error(`No connected credentials found for ${type}:${email}`);
  }

  const bufferTime = 60 * 1000; // 60-second safety margin
  if (record.expires_at > Date.now() + bufferTime) {
    return record.access_token;
  }

  if (!record.refresh_token) {
    throw new Error(`Access token expired and no refresh token is stored for ${email}. Please reconnect.`);
  }

  try {
    console.log(`Refreshing expired token for ${email}...`);
    const refreshed = await refreshGoogleToken(record.refresh_token);
    
    const updatedRecord: TokenRecord = {
      ...record,
      access_token: refreshed.access_token,
      expires_at: Date.now() + refreshed.expires_in * 1000,
      last_sync: new Date().toISOString()
    };
    
    TokenDb.set(userId, type, email, updatedRecord);
    return refreshed.access_token;
  } catch (e: any) {
    console.error(`Failed to refresh token for ${email}:`, e);
    throw new Error(`Could not refresh Google session for ${email}: ${e.message}. Please sign in again.`);
  }
}

/**
 * Format Google API error messages to be user-friendly and actionable
 */
function getFriendlyGoogleError(status: number, rawText: string, context: 'sheets' | 'gmail' | 'general'): string {
  try {
    const parsed = JSON.parse(rawText);
    if (parsed.error) {
      const msg = parsed.error.message || '';
      const statusStr = parsed.error.status || '';

      if (status === 403) {
        if (msg.includes('disabled') || msg.includes('has not been used') || msg.includes('Google Sheets API')) {
          return `Google Sheets/Drive API has not been enabled in your Google Cloud Console. Action required: Open https://console.cloud.google.com/, select your project, go to "APIs & Services" -> "Library", search for "Google Sheets API" and "Google Drive API", and click "Enable".`;
        }
        if (msg.includes('permission') || statusStr === 'PERMISSION_DENIED') {
          return `Access Denied (403): Your connected account does not have permission to read this Spreadsheet. Action required: 1) Open the Spreadsheet in Google Sheets and click the "Share" button. 2) Set access to 'Anyone with the link can view' OR share it directly with the email of the account you logged in with (${context === 'sheets' ? 'your connected Sheets account' : 'your Google account'}).`;
        }
      }
      return `${msg} (Google status: ${statusStr || status})`;
    }
  } catch (e) {
    // Not valid JSON or failed to parse, use fallback
  }

  if (status === 403) {
    return `Access Denied (403). Possible causes: 1) The Google Sheets or Google Drive API is not enabled in your Google Cloud Developer Console. 2) The spreadsheet is private and not shared with your connected account.`;
  }
  return `${rawText} (HTTP Status ${status})`;
}

/**
 * Parse Google Sheets data from Spreadsheet API
 */
export async function fetchSpreadsheetData(spreadsheetId: string, accessToken: string) {
  // 1. Fetch metadata to find sheets
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!metaRes.ok) {
    const errText = await metaRes.text();
    const friendlyError = getFriendlyGoogleError(metaRes.status, errText, 'sheets');
    throw new Error(friendlyError);
  }

  const metaData = await metaRes.json();
  const sheetName = metaData.sheets?.[0]?.properties?.title || 'Sheet1';

  // 2. Fetch sheet values
  const valuesRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!valuesRes.ok) {
    const errText = await valuesRes.text();
    const friendlyError = getFriendlyGoogleError(valuesRes.status, errText, 'sheets');
    throw new Error(`Google Sheets value retrieval failed: ${friendlyError}`);
  }

  const valuesData = await valuesRes.json();
  const values: string[][] = valuesData.values || [];

  if (values.length === 0) {
    return { sheetName, headers: [], rows: [] };
  }

  const headers = values[0].map(h => (h || '').trim()).filter(Boolean);
  const rows = values.slice(1).map(rowValues => {
    const rowObj: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowObj[header] = (rowValues[index] || '').toString().trim();
    });
    return rowObj;
  }).filter(row => Object.keys(row).length > 0);

  return {
    sheetName,
    headers,
    rows
  };
}

/**
 * Send email via Gmail API
 */
export async function sendGmailMessage(
  fromEmail: string,
  toEmail: string,
  subject: string,
  htmlBody: string,
  accessToken: string
) {
  // Construct RFC 2822 formatted message plain content or HTML
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageLines = [
    `From: <${fromEmail}>`,
    `To: <${toEmail}>`,
    `Subject: ${utf8Subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    htmlBody
  ];

  const rawMessage = messageLines.join('\r\n');
  const encodedMessage = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: encodedMessage }),
  });

  if (!response.ok) {
    const errText = await response.text();
    const friendlyError = getFriendlyGoogleError(response.status, errText, 'gmail');
    throw new Error(friendlyError);
  }

  return response.json();
}
