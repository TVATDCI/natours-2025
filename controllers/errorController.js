// In Express middlewares or route handlers, where "early return" style
// improves clarity and avoids nesting for writing clean, readable code!

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
    return res.status(err.statusCode).json({
      status: err.status,
      error: err, // Entire error object
      message: err.message, // Useful error message
      stack: err.stack, // Stack trace for debugging
    });
  }

  // ======================================
  // PRODUCTION MODE: avoid leaking sensitive info
  // ======================================
  if (process.env.NODE_ENV === 'production') {
    // Operational (trusted) error: send specific message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // Programming or unknown error: log and send generic message
    console.error('UNEXPECTED ERROR:', err); // Log full error to server logs

    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // ======================================
  // DEFAULT FALLBACK (safety net for misconfigured NODE_ENV)
  // ======================================
  res.status(err.statusCode).json({
    status: err.status,
    message: 'An unexpected error occurred.',
  });
};

// module.exports = (err, req, res, next) => {
//   // Set default values
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   // Only send full error in development
//   if (process.env.NODE_ENV === 'development') {
//     res.status(err.statusCode).json({
//       status: err.status,
//       error: err,
//       message: err.message,
//       stack: err.stack, // bugs hunter - calling stack trace (for development) of where the err occurred line by line!
//     });
//   } else if (process.env.NODE_ENV === 'production') {
//     // Only send safe info to client
//     if (err.isOperational) {
//       res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message,
//       });
//     } else {
//       // Programming or unknown error: don't leak details
//       console.error('UNEXPECTED ERROR ', err);
//       res.status(500).json({
//         status: 'error',
//         message: 'Something in Programming or unknown went wrong!',
//       });
//     }
//   }
// };
