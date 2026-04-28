import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';

// Node.js Native Crypto Engine

export const hashPassword = (password) => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
};

export const verifyPassword = (password, salt, hash) => {
  const keyToCheck = scryptSync(password, salt, 64);
  const originalHash = Buffer.from(hash, 'hex');
  return timingSafeEqual(keyToCheck, originalHash);
};
