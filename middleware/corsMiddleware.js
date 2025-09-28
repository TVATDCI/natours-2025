const cors = require('cors');

// Created whitelist(allowedOrigins) to enable CORS to allow frontend requests
// Also add dynamic origin based on environment.
// So different frontend URLs in development and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
  'https://staging.natours-2025.com',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Don’t throw an error — send a CORS rejection
      callback(null, false);
    }
  },
  credentials: true,
};

module.exports = cors(corsOptions);
