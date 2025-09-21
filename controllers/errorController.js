const AppError = require('../utils/appError');

// =====================
// Handling MongoDB Cast Error
// =====================
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

// =======================================
// Handling MongoDB duplicate field ERROR
// =======================================

const handleDuplicationFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0]; // v.2 access Mongoose err.keyValue directly (2025)
  const value = err.keyValue[field]; // Using **err.keyValue** is more reliable and cleaner

  const message = `Duplicate field "${field}" and value "${value}" already exist - Please use another value`;
  return new AppError(message, 400);
};

// =================================
// Handling MongoDB Validation ERROR
// =================================

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// =================================
// Handling invalid JWT ERROR
// =================================
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

// =================================
// Handling expired JWT ERROR
// =================================
const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

// =====================
// DEVELOPMENT ERROR
// =====================
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // API → JSON response
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message, // To the clients
      stack: err.stack,
    });
  }

  // Programming or Unknown errors → Don't leak details
  // Log error- Checking in development
  console.error('ERROR 🧨', err);
  // RENDERED WEBSITE - Customized title 404 (page not found) VS Generic message
  const title =
    err.statusCode === 404 ? 'Page not found!' : 'Something went wrong!';
  return res.status(err.statusCode).render('error', {
    title,
    msg: err.message,
  });
};
// =====================
// PRODUCTION ERROR
// =====================
const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send specific message
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    console.error('ERROR 🧨', err);

    // send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) RENDERED WEBSITE - 404 → title: “Page not found!” VS AppError message
  // Operational, trusted error: send specific message
  if (err.isOperational) {
    const title =
      err.statusCode === 404 ? 'Page not found!' : 'Something went wrong!';
    return res.status(err.statusCode).render('error', {
      title,
      msg: err.message,
    });
  }

  // Programming or IF UNKNOWN errors → GENERIC FALLBACK!
  console.error('ERROR 💥', err);
  return res.status(500).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
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
    return sendErrorDev(err, req, res);
  }

  // ======================================
  // PRODUCTION MODE: avoid leaking sensitive info
  // ======================================
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message };

    // =============================================
    // Handle known operational error types with custom messages
    // =============================================
    // Handling MongoDB Cast Error
    if (err.name === 'CastError') error = handleCastErrorDB(err);
    // =============================================
    // Handling MongoDB duplicate field errors
    if (err.code === 11000) error = handleDuplicationFieldsDB(err);
    // =============================================
    // Handling MongoDB Validation Error
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    // =============================================
    // Handling JWT errors
    // =============================================
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    // =================================
    // Handling invalid JWT ERROR
    // =================================
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    // =============================================
    // To be continued!

    return sendErrorProd(error, req, res);
  }

  // Fallback for misconfigured NODE_ENV
  res.status(err.statusCode).json({
    status: err.status,
    message: 'An unexpected error occurred.',
  });
};
