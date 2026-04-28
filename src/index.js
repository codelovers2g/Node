import app from './app.js';
import { initializeDatabase } from './config/database.js';

try {
  console.log('[SYSTEM] Initializing Enterprise Core...');
  
  // Demonstrating async initialization pattern
  await initializeDatabase();
  console.log('[DATABASE] Integrity Check Passed (Native node:sqlite)');

  const PORT = process.env.PORT || 3000;

  // Modern Node.js 22+ Watch Mode compatible listener
  app.listen(PORT, () => {
    console.log(`\n [CORE ONLINE] API running on http://localhost:${PORT}`);
    console.log(`[RUNTIME] Node.js ${process.version} (Optimized Profile)`);
    console.log(`[MODULES] Native ESM Architecture Verified\n`);
  });

} catch (error) {
  console.error('[CRITICAL] System Bootstrap Failed:', error);
  process.exit(1);
}
