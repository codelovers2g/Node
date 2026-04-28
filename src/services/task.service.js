import db from '../config/database.js';

export const getAllTasks = (userId) => {

  // Native prepared statement using Node.js built-in `node:sqlite` driver
 // Dependency-free and optimized for runtime performance

  const statement = db.prepare('SELECT * FROM tasks WHERE userId = ?');
  
  // High-performance data retrieval using native prepared statement execution
  return statement.all(userId);
};

export const createTask = (userId, title) => {
  // NATIVE MODULE BINDING
  const insert = db.prepare('INSERT INTO tasks (userId, title) VALUES (?, ?)');
  
  // Executes insert operation and returns row metadata immediately
  const result = insert.run(userId, title);
  
  // Generates a unique trace identifier using Node.js standard library
  return { 
    id: result.lastInsertRowid, 
    title, 
    completed: false,
    traceId: crypto.randomUUID() 
  };
};

export const updateTaskStatus = (userId, taskId, completed) => {
  // ATOMIC SYNCHRONIZATION 
  const update = db.prepare('UPDATE tasks SET completed = ? WHERE id = ? AND userId = ?');
  
  // result.changes returns the number of rows affected natively
  const result = update.run(completed ? 1 : 0, taskId, userId);
  
  return result.changes > 0;
};