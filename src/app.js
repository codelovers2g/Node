import express from 'express';
import { uptime, memoryUsage, version } from 'node:process';
import { totalmem, freemem } from 'node:os';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';

const app = express();

/**
 * Global Middleware Configuration
 * Optimized for high-throughput JSON processing
 */
app.use(express.json());
app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// System Runtime Diagnostics
app.get('/api/system/diagnostics', async (req, res) => {
  const { rss, heapUsed } = memoryUsage();
  
  res.status(200).json({
    engine: `Node.js ${version}`,
    status: 'SYSTEM_STABLE',
    telemetry: {
      uptime: `${Math.floor(uptime() / 60)}m`,
      memory: `${(rss / 1024 / 1024).toFixed(2)} MB`
    }
  });
});

// Global Error Lifecycle Handler
app.use((err, req, res, next) => {
  console.error('[FATAL EXCEPTION]:', err);
  res.status(500).json({ 
    error: 'Internal System Error', 
    timestamp: new Date().toISOString() 
  });
});

export default app;
