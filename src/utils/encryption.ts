import crypto from 'crypto';

/**
 * Utility for encrypting and decrypting sensitive data
 * Uses AES-256-GCM encryption which provides both confidentiality and integrity
 */

// Environment variables should be set in .env file
const ENCRYPTION_KEY = process.env.VITE_ENCRYPTION_KEY || '';
const ENCRYPTION_IV_LENGTH = 16;
const ENCRYPTION_TAG_LENGTH = 16;
const ENCRYPTION_ALGORITHM = 'aes-256-gcm';

// Validate encryption key on initialization
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length < 32) {
  console.error('WARNING: Encryption key is missing or too short. Sensitive data will not be properly encrypted!');
}

/**
 * Encrypts sensitive data using AES-256-GCM
 * @param text - Plain text to encrypt
 * @returns Encrypted data as a base64 string with IV and auth tag
 */
export function encrypt(text: string): string {
  try {
    // Generate a random initialization vector
    const iv = crypto.randomBytes(ENCRYPTION_IV_LENGTH);
    
    // Create cipher using key and IV
    const cipher = crypto.createCipheriv(
      ENCRYPTION_ALGORITHM, 
      Buffer.from(ENCRYPTION_KEY), 
      iv
    );
    
    // Encrypt the data
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    // Get the authentication tag
    const authTag = cipher.getAuthTag();
    
    // Combine IV, encrypted data, and auth tag into a single string
    // Format: base64(iv):base64(authTag):base64(encryptedData)
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypts data that was encrypted with the encrypt function
 * @param encryptedData - Encrypted data in the format: base64(iv):base64(authTag):base64(encryptedData)
 * @returns Decrypted plain text
 */
export function decrypt(encryptedData: string): string {
  try {
    // Split the encrypted data into its components
    const [ivBase64, authTagBase64, encryptedText] = encryptedData.split(':');
    
    if (!ivBase64 || !authTagBase64 || !encryptedText) {
      throw new Error('Invalid encrypted data format');
    }
    
    // Convert components from base64
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(
      ENCRYPTION_ALGORITHM, 
      Buffer.from(ENCRYPTION_KEY), 
      iv
    );
    
    // Set the authentication tag
    decipher.setAuthTag(authTag);
    
    // Decrypt the data
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Checks if a string is already encrypted
 * @param text - Text to check
 * @returns Boolean indicating if the text appears to be encrypted
 */
export function isEncrypted(text: string): boolean {
  // Check if the text matches our encryption format
  const parts = text.split(':');
  if (parts.length !== 3) return false;
  
  try {
    // Try to decode the IV and auth tag from base64
    const iv = Buffer.from(parts[0], 'base64');
    const authTag = Buffer.from(parts[1], 'base64');
    
    // Check if IV and auth tag have the expected lengths
    return iv.length === ENCRYPTION_IV_LENGTH && authTag.length === ENCRYPTION_TAG_LENGTH;
  } catch (e) {
    return false;
  }
}

/**
 * Safely encrypts data, checking if it's already encrypted first
 * @param text - Text to encrypt
 * @returns Encrypted text
 */
export function safeEncrypt(text: string): string {
  if (!text) return text;
  return isEncrypted(text) ? text : encrypt(text);
}

/**
 * Safely decrypts data, checking if it's encrypted first
 * @param text - Text to decrypt
 * @returns Decrypted text
 */
export function safeDecrypt(text: string): string {
  if (!text) return text;
  return isEncrypted(text) ? decrypt(text) : text;
}

/**
 * Hashes a string using SHA-256
 * @param text - Text to hash
 * @returns Hashed text
 */
export function hash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Creates a secure random token of specified length
 * @param length - Length of token in bytes (default: 32)
 * @returns Random token as a hex string
 */
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
