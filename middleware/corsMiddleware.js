const cors = require('cors');

// Created whitelist(allowedOrigins) to enable CORS to allow frontend requests
// Also add dynamic origin based on environment.
// So different frontend URLs in development and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:5173', // Vite dev
  'https://natours-2025.onrender.com', // Production frontend
];

const corsOptions = {
  // Allow requests with no origin (like mobile apps or curl requests)
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true, // Allow cookies and credentials
};

module.exports = cors(corsOptions);
