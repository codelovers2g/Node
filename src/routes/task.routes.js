import { Router } from 'express';
import * as taskController from '../controllers/task.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

/*
 * Task Management Routes
 * All endpoints secured via enterprise auth middleware
 */
router.use(authenticate);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTask);

export default router;
