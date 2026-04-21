import { DatabaseSync } from 'node:sqlite';

/**
 * NATIVE SQLITE ENGINE (Node.js 22.5.0+)
 * Zero-dependency, native binary driver built into the Node runtime.
 * High performance, no 'node-gyp' build issues, and standard SQlite support.
 */
const db = new DatabaseSync(':memory:');

export const initializeDatabase = async () => {
  // exec() is synchronous in DatabaseSync, but we wrap it in a Promise 
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      salt TEXT
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      title TEXT,
      completed BOOLEAN DEFAULT 0,
      FOREIGN KEY(userId) REFERENCES users(id)
    );
  `);
};

export default db;
