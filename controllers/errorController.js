module.exports = (err, req, res, next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Only send full error in development
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack, // calling stack trace (for development) of where the err occurred line by line!
    });
  } else if (process.env.NODE_ENV === 'production') {
    // Only send safe info to client
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      // Programming or unknown error: don't leak details
      console.error('UNEXPECTED ERROR ', err);
      res.status(500).json({
        status: 'error',
        message: 'Something in Programming or unknown went wrong!',
      });
    }
  }
};
