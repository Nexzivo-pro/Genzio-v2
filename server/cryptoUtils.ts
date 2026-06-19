import crypto from 'crypto';

// Use a secure fallback or the workspace secret
const CRYPTO_SECRET = process.env.GOOGLE_OAUTH_CRYPTO_SECRET || process.env.SESSION_SECRET || 'genzio_email_automation_secure_oauth_credentials_salt_2026';

export function encrypt(text: string): string {
  // Hash with SHA-256 to ensure a safe, precise 32-byte key
  const key = crypto.createHash('sha256').update(CRYPTO_SECRET).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
  const key = crypto.createHash('sha256').update(CRYPTO_SECRET).digest();
  const parts = text.split(':');
  if (parts.length !== 2) {
    throw new Error('Invalid encrypted format: missing IV parts');
  }
  const iv = Buffer.from(parts[0], 'hex');
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
