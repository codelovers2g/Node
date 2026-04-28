import db from '../config/database.js';
import { hashPassword, verifyPassword } from '../utils/crypto.js';

/**
 * This service handles security-critical operations using Node.js native
 * cryptographic engines and the built-in SQLite driver.
 */

/**
 * Provisions a new user identity in the system.
 * @param {string} username - Unique identifier for the user
 * @param {string} password - Raw password to be hashed
 * @returns {Object} - The created user metadata
 */
export const createUser = (username, password) => {
  const { salt, hash } = hashPassword(password);
  
  try {
    const insert = db.prepare('INSERT INTO users (username, password, salt) VALUES (?, ?, ?)');
    const result = insert.run(username, hash, salt);
    
    return {
      id: result.lastInsertRowid,
      username,
      status: 'provisioned'
    };
  } catch (error) {
    if (error.message.includes('UNIQUE')) {
      const conflictError = new Error('Identity already exists');
      conflictError.code = 'IDENTITY_CONFLICT';
      throw conflictError;
    }
    throw error;
  }
};

/**
 * Validates a user's credentials against the secure identity store.
 * @param {string} username - The identifier provided by the client
 * @param {string} password - The raw credentials to verify
 * @returns {Object|null} - User object if valid, null otherwise
 */
export const authenticateUser = (username, password) => {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (user && verifyPassword(password, user.salt, user.password)) {
    return {
      id: user.id,
      username: user.username
    };
  }

  return null;
};
