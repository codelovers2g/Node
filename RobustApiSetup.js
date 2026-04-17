/**
 * Latest Version Used: Node.js v24.12.0 / Express v5.0.0
 * File Purpose: Robust REST API Architecture with Native SQLite & Authentication
 * Created Date: 2026-04-17
 */

import express from 'express';
import { DatabaseSync } from 'node:sqlite'; // Added in Node 22.5.0
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

// Initialize zero-dependency native SQLite database
const db = new DatabaseSync(':memory:');
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    salt TEXT
  );
  CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    title TEXT,
    completed BOOLEAN DEFAULT 0,
    FOREIGN KEY(userId) REFERENCES users(id)
  );
`);

const app = express();
app.use(express.json());

/**
 * Modern Node.js Architecture: Native SQLite, Express 5 Async Error Handling,
 * and built-in performant cryptography patterns.
 */
const hashPassword = (password) => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
};

const verifyPassword = (password, salt, hash) => {
  const keyToCheck = scryptSync(password, salt, 64);
  const originalHash = Buffer.from(hash, 'hex');
  return timingSafeEqual(keyToCheck, originalHash);
};

// Express 5: Automatic rejection of unhandled promises in route handlers
// No 'next(err)' required for async failures anymore!
app.get('/api/health', async (req, res) => {
  const status = { 
    uptime: process.uptime(),
    db: db.prepare('SELECT 1').get() ? 'up' : 'down',
    timestamp: Date.now()
  };
  res.status(200).json(status);
});

// Using modern parsing patterns and native SQLite prepare/get
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const { salt, hash } = hashPassword(password);
  
  const insert = db.prepare('INSERT INTO users (username, password, salt) VALUES (?, ?, ?)');
  insert.run(username, hash, salt);
  
  res.status(201).json({ message: 'User registered successfully' });
});


// --- Authentication Middleware ---
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });
  
  // Minimalistic auth for demo purposes
  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  
  if (user && verifyPassword(password, user.salt, user.password)) {
    req.user = user;
    return next();
  }
  res.status(403).json({ error: 'Invalid credentials' });
};

// --- CRUD Endpoints ---

// Get all tasks for authenticated user
app.get('/api/tasks', authenticate, async (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE userId = ?').all(req.user.id);
  res.json(tasks);
});

// Create task
app.post('/api/tasks', authenticate, async (req, res) => {
  const { title } = req.body;
  if (!title) throw new Error('Title is required'); // Express 5 catches this!
  
  const insert = db.prepare('INSERT INTO tasks (userId, title) VALUES (?, ?)');
  const result = insert.run(req.user.id, title);
  
  res.status(201).json({ id: result.lastInsertRowid, title, completed: false });
});

// Update task status
app.patch('/api/tasks/:id', authenticate, async (req, res) => {
  const { completed } = req.body;
  const update = db.prepare('UPDATE tasks SET completed = ? WHERE id = ? AND userId = ?');
  update.run(completed ? 1 : 0, req.params.id, req.user.id);
  
  res.json({ message: 'Task updated' });
});

// --- Server Initialization ---
const PORT = process.env.PORT || 3000;

// Use top-level await if initialization requires external resources (e.g. cloud secrets)
try {
  app.listen(PORT, () => {
    console.log(`🚀 Modern Node.js API running on http://localhost:${PORT}`);
    console.log(`⭐ Using Node.js ${process.version} features`);
  });
} catch (error) {
  console.error('Failed to start server:', error);
  process.exit(1);
}
