import * as taskService from '../services/task.service.js';

export const getTasks = async (req, res) => {
  const tasks = taskService.getAllTasks(req.user.id);
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Payload title is required' });
  }
  
  const task = taskService.createTask(req.user.id, title);
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  
  const success = taskService.updateTaskStatus(req.user.id, id, completed);
  
  if (success) {
    res.json({ success: true, message: 'Entity synchronization complete' });
  } else {
    res.status(404).json({ error: 'Entity not found or access denied' });
  }
};
