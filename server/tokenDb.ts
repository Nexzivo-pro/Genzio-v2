import fs from 'fs';
import path from 'path';
import { encrypt, decrypt } from './cryptoUtils';

const DB_PATH = path.join(process.cwd(), 'oauth_tokens.json');

export interface TokenRecord {
  userId: string;
  email: string;
  name?: string;
  picture?: string;
  type: 'gmail' | 'sheets';
  access_token: string;
  refresh_token: string | null;
  expires_at: number; // millisecond epoch timestamp
  last_sync: string;  // ISO string
}

export class TokenDb {
  private static load(): Record<string, string> {
    if (!fs.existsSync(DB_PATH)) {
      return {};
    }
    try {
      const content = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(content);
    } catch (e) {
      console.error('Failed to read or parse oauth_tokens.json:', e);
      return {};
    }
  }

  private static save(data: Record<string, string>) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write oauth_tokens.json:', e);
    }
  }

  public static get(userId: string, type: 'gmail' | 'sheets', email: string): TokenRecord | null {
    const data = this.load();
    const key = `${userId}:${type}:${email.toLowerCase().trim()}`;
    const encrypted = data[key];
    if (!encrypted) return null;
    try {
      const decrypted = decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch (e) {
      console.error(`Failed to decrypt credentials for key ${key}:`, e);
      return null;
    }
  }

  public static set(userId: string, type: 'gmail' | 'sheets', email: string, record: TokenRecord) {
    const data = this.load();
    const key = `${userId}:${type}:${email.toLowerCase().trim()}`;
    const encrypted = encrypt(JSON.stringify(record));
    data[key] = encrypted;
    this.save(data);
  }

  public static list(userId: string): TokenRecord[] {
    const data = this.load();
    const records: TokenRecord[] = [];
    for (const key of Object.keys(data)) {
      // Check if key starts with the partition prefix "userId:"
      if (key.startsWith(`${userId}:`)) {
        const encrypted = data[key];
        try {
          const decrypted = decrypt(encrypted);
          records.push(JSON.parse(decrypted));
        } catch (e) {
          console.error(`Failed to decrypt record for key ${key}:`, e);
        }
      }
    }
    return records;
  }

  public static delete(userId: string, type: 'gmail' | 'sheets', email: string): boolean {
    const data = this.load();
    const key = `${userId}:${type}:${email.toLowerCase().trim()}`;
    if (data[key]) {
      delete data[key];
      this.save(data);
      return true;
    }
    return false;
  }
}
