// backend/utils/encryptionService.js

const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
// The ENCRYPTION_KEY must be 32 bytes (256 bits) for aes-256-cbc
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
// The IV must be 16 bytes for aes-256-cbc
const IV_LENGTH = 16;

/**
 * Encrypts a piece of text.
 * @param {string} text - The text to encrypt.
 * @returns {string} - The encrypted text, formatted as iv:encryptedData
 */
function encrypt(text) {
  if (!text) return null;

  // Generate a random Initialization Vector (IV) for each encryption
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return the IV and the encrypted data, separated by a colon
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts a piece of text.
 * @param {string} text - The encrypted text (e.g., 'iv:encryptedData').
 * @returns {string} - The decrypted text.
 */
function decrypt(text) {
  if (!text) return null;

  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted.toString();
}

module.exports = { encrypt, decrypt };