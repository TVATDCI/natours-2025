/* eslint-disable */
const dotenv = require('dotenv');

// =============================
// Handle Synchronous Exceptions
// =============================
process.on('uncaughtException', (err) => {
  console.error('🔴 Uncaught Exception! Shutting down...');
  console.error(err.name, err.message);
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
process.on('unhandledRejection', (err) => {
  console.error('🔴 Unhandled Rejection! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
