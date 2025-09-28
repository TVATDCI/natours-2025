const cors = require('cors');

// Created whitelist(allowedOrigins) to enable CORS to allow frontend requests
// Also add dynamic origin based on environment.
// So different frontend URLs in development and production
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  // Allow requests with no origin (like mobile apps or curl requests)
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (process.env.NODE_ENV === 'development') {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and credentials
};

module.exports = cors(corsOptions);
