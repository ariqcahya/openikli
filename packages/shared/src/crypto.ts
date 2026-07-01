import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not set.');
  }
  // Ensure key is exactly 32 bytes/characters
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 characters long.');
  }
  return Buffer.from(key, 'utf8');
}

/**
 * Encrypts plain text using AES-256-GCM
 */
export function encrypt(text: string): string {
  if (!text) return '';
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  // Format: iv_hex:auth_tag_hex:encrypted_hex
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts cipher text using AES-256-GCM
 */
export function decrypt(cipherText: string): string {
  if (!cipherText) return '';
  const key = getEncryptionKey();
  
  const parts = cipherText.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted text format.');
  }

  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
