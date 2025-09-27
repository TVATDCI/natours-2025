/* eslint-disable */
const dotenv = require('dotenv');

// =============================
// Handle Synchronous Exceptions
// =============================
process.on('uncaughtException', (err) => {
  console.error('🔴 Uncaught Exception! Shutting down...');
  console.error(err.stack || `${err.name}: ${err.message}`);
  process.exit(1);
});

// =============================
// Load Environment Variables
// =============================
dotenv.config({ path: './config.env' });

const connectDB = require('./config/db');
const app = require('./app');

// =============================
// Database Connection
// =============================
connectDB(); // No catch here — failures bubble to unhandledRejection

// =============================
// Start Server
// =============================
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🌐 App running on port ${port}...`);
});

// =============================
// Graceful Shutdown Function
// =============================
const gracefulShutdown = (signal, err) => {
  console.error(`\n🔴 Received ${signal}. Shutting down gracefully...`);
  if (err) console.error(err.stack || `${err.name}: ${err.message}`);

  let exitCode = 0;
  if (signal === 'unhandledRejection' || signal === 'uncaughtException') {
    exitCode = 1;
  }

  const timeout = setTimeout(() => {
    console.error(
      '🟡 Could not close connections in time, forcefully shutting down',
    );
    process.exit(1);
  }, 10000);

  server.close(() => {
    clearTimeout(timeout);
    console.log('🟢 Closed out remaining connections.');
    process.exit(exitCode);
  });
};

// Handle SIGINT (Ctrl+C) and SIGTERM (Render/Heroku/etc.)
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
  gracefulShutdown('unhandledRejection', err);
});
