/* eslint-disable */
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.error('🧨 :UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const connectDB = require('./config/db');
const app = require('./app');

// Connect to Database
connectDB(); // No catch here — failures go to unhandledRejection

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port:🌐: ${port}...`);
});

// ======================================
// Global Unhandled Promise Rejection Handler
// (Async errors outside Express)
process.on('unhandledRejection', (err) => {
  console.error('🔴 :UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
