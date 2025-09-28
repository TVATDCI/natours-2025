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
// No catch here — failures bubble to unhandledRejection
connectDB();

// =============================
// Start Server
// =============================
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🌐 App running on port ${port}...`);
});

// =============================
// Handle Unhandled Rejections
// =============================
// Graceful shutdown function
const gracefulShutdown = (signal) => {
  console.log(`\n🔴 Received ${signal}. Shutting down gracefully...`);

  server.close(() => {
    console.log('🟢 Closed out remaining connections.');
    process.exit(0);
  });
};
// Handle SIGINT (Ctrl+C) and SIGTERM (Render/Heroku/etc.)
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('🔴 Unhandled Rejection! Shutting down...');
  console.error(err.stack || `${err.name}: ${err.message}`);

  server.close(() => process.exit(1));
});
