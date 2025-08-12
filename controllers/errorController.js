// ======================================
// errorController.js / Global Error Handler
// ======================================
// 1. Imports
// 2. Helper functions (like handleCastErrorDB)
// 3. Error response functions (sendErrorDev / sendErrorProd)
// 4. Exported middleware (main error handler)

const AppError = require('../utils/appError');

// =====================
// Handling MongoDB Cast Error
// =====================
// 400 Bad Request for invalid ObjectId formats
// MongoDB: Invalid ID (CastError)
// In Production only.
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

// NOTE: Switch to production

// NOTE: error example: 400 Bad Request! from DB err
// "status": "error",
// "error": {
//     "stringValue": "\"6885669311c1889fa57wwwww\"",
//     "valueType": "string",
//     "kind": "ObjectId",
//     "value": "6885669311c1889fa57wwwww",
//     "path": "_id",
//     "reason": {},
//     "name": "CastError",
//     "message": "Cast to ObjectId failed for value \"6885669311c1889fa57wwwww\" (type string) at path \"_id\" for model \"Tour\""
// },
// NOTE: To 400 Bad Request! from AppError!
// {
//     "status": "fail",
//     "message": "Invalid _id: 6885669311c1889fa57wwwww."
// }

// =======================================
// Handling MongoDB duplicate field ERROR
// =======================================

const handleDuplicationFieldsDB = (err) => {
  //   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; // v.1 - Regex
  //DEBUG: if the value of err.errmsg matches regEx as 1st index
  // console.log(value);

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
  const message = `Invalid input data: ${errors.join('. ')}`; // Join the messages together with .(dot)_(space)
  return new AppError(message, 400);
};

// =================================
// Handling invalid JWT ERROR
// =================================
// BTW. ES6 arrow function - use an implicit return to simplify arrow function by removing the curly braces and the return keyword!
// REASON: Curly braces + return are only needed if your function body has multiple statements.
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
    // DEBUG: in development if you are too lazy to switch to :prod
    // tracking err.name CastError for during dev amd hardcoded to bad request!
    if (err.name === 'CastError') err.statusCode = 400;
    return sendErrorDev(err, res);
  }

  // ======================================
  // PRODUCTION MODE: avoid leaking sensitive info
  // ======================================
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    // error.message preserve message before the error gets transformed or doesn't
    error.message = err.message;
    // Avoids 'undefined' messages or missing logs in transformed errors.

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
