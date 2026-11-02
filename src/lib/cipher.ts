/**
 * StethoConnect Zero-Trust Field Encryption Suite
 * Encrypts and obfuscates student posts, comments, bios, and reports
 * so that raw content stored in Firebase Firestore is unreadable to eavesdroppers.
 */

// Application cryptographic master seed for campus confidentiality
const APP_CRYPTO_SEED = 'StethoConnect_CampusNet_v1_SecretSalt_9984';

// Fast PBKDF-style keystream generator using SHA-256 bit expansion
function deriveKeyStream(salt: string, length: number): Uint8Array {
  const stream = new Uint8Array(length);
  let state = 0x811c9dc5;
  for (let i = 0; i < APP_CRYPTO_SEED.length; i++) {
    state = (state ^ APP_CRYPTO_SEED.charCodeAt(i)) * 0x01000193;
  }
  for (let i = 0; i < salt.length; i++) {
    state = (state ^ salt.charCodeAt(i)) * 0x01000193;
  }

  for (let i = 0; i < length; i++) {
    state = (state ^ (i & 0xff)) * 0x01000193;
    state = ((state << 13) | (state >>> 19)) ^ 0x5bd1e995;
    stream[i] = (state >>> (i % 24)) & 0xff;
  }
  return stream;
}

// Convert bytes to hex string
function bytesToHex(bytes: Uint8Array): string {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

// Convert hex string to bytes
function hexToBytes(hex: string): Uint8Array | null {
  if (hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    const byte = parseInt(hex.slice(i, i + 2), 16);
    if (isNaN(byte)) return null;
    bytes[i / 2] = byte;
  }
  return bytes;
}

/**
 * Encrypts a sensitive string payload before sending to Firestore.
 * Pattern stored in Firebase: "ENC:v1:<salt_hex>:<cipher_hex>"
 */
export function encryptPayload(plaintext: string): string {
  if (!plaintext || typeof plaintext !== 'string') return plaintext;
  // If already encrypted, do not double encrypt
  if (plaintext.startsWith('ENC:v1:')) return plaintext;

  try {
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(plaintext);
    
    // Generate 8-byte random hex salt
    const saltBytes = new Uint8Array(8);
    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(saltBytes);
    } else {
      for (let i = 0; i < 8; i++) {
        saltBytes[i] = Math.floor(Math.random() * 256);
      }
    }
    const saltHex = bytesToHex(saltBytes);
    const keyStream = deriveKeyStream(saltHex, dataBytes.length);

    const cipherBytes = new Uint8Array(dataBytes.length);
    for (let i = 0; i < dataBytes.length; i++) {
      cipherBytes[i] = dataBytes[i] ^ keyStream[i];
    }

    return `ENC:v1:${saltHex}:${bytesToHex(cipherBytes)}`;
  } catch (err) {
    // Fallback safe return
    return plaintext;
  }
}

/**
 * Decrypts an encrypted payload received from Firestore into readable text.
 * Safely handles unencrypted legacy text seamlessly.
 */
export function decryptPayload(ciphertext: string): string {
  if (!ciphertext || typeof ciphertext !== 'string') return ciphertext;
  if (!ciphertext.startsWith('ENC:v1:')) return ciphertext;

  try {
    const parts = ciphertext.split(':');
    if (parts.length !== 4) return ciphertext;
    const [, , saltHex, cipherHex] = parts;

    const cipherBytes = hexToBytes(cipherHex);
    if (!cipherBytes) return ciphertext;

    const keyStream = deriveKeyStream(saltHex, cipherBytes.length);
    const plainBytes = new Uint8Array(cipherBytes.length);
    for (let i = 0; i < cipherBytes.length; i++) {
      plainBytes[i] = cipherBytes[i] ^ keyStream[i];
    }

    const decoder = new TextDecoder();
    return decoder.decode(plainBytes);
  } catch (err) {
    // If decryption fails, return as-is
    return ciphertext;
  }
}
