// ======================================
// errorController.js
// ======================================
// 1. Imports
// 2. Helper functions (like handleCastErrorDB)
// 3. Error response functions (sendErrorDev / sendErrorProd)
// 4. Exported middleware (main error handler)

const AppError = require('../utils/appError');

// =====================
// HELPER FUNCTIONS
// =====================
// 400 Bad Request for invalid ObjectId formats
// MongoDB: Invalid ID (CastError)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

// =====================
// DEVELOPMENT ERROR
// =====================
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err, // Entire error object
    message: err.message, // Human-readable message
    stack: err.stack, // Stack trace for debugging
  });
};

// =====================
// PRODUCTION ERROR
// =====================
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send specific message
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Programming or unknown error: don't leak details and send generic message
  console.error('ERROR 🧨', err);

  return res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

module.exports = (err, req, res, next) => {
  // ======================================
  // SET DEFAULTS
  // ======================================
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // ======================================
  // DEVELOPMENT MODE: send full error details
  // ======================================
  if (process.env.NODE_ENV === 'development') {
    if (err.name === 'CastError') err.statusCode = 400; // tracking 400 Bad Request for invalid ObjectId formats during dev!

    return sendErrorDev(err, res);
  }

  // ======================================
  // PRODUCTION MODE: avoid leaking sensitive info
  // ======================================
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message; // preserve message
    if (err.name === 'CastError') error = handleCastErrorDB(err);

    return sendErrorProd(error, res);
  }

  // ======================================
  // DEFAULT FALLBACK (safety net for misconfigured NODE_ENV)
  // ======================================
  res.status(err.statusCode).json({
    status: err.status,
    message: 'An unexpected error occurred.',
  });
};
