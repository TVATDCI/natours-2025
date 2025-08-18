const express = require('express');
const cookieParser = require('cookie-parser');

const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// const sanitizeQuery = require('./middleware/sanitizeQuery'); // clean query parameters in G scope

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
// ======================================
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// ======================================
// #: GLOBAL MIDDLEWARES
// ======================================

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security: Set secure HTTP headers
app.use(helmet());

// Rate limiting: Limit 100 requests per IP / hour (applies to /api)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// ======================================
// #: UTILITY MIDDLEWARES
// ======================================

// Body parser, reading data from body (limit payload to 10kb) to req.body
app.use(express.json({ limit: '10kb' }));

// Cookie parser: parses cookies into req.cookies
app.use(cookieParser());

// (Optional) Query sanitization
// app.use(sanitizeQuery);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Add request timestamp for debugging
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers); // DEBUG: log request headers
  next();
});

// ======================================
// #: Mounted Routers from routes/ to the base path
// ======================================
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// ======================================
// #: Refactored Operational Error handler
// ======================================
// Handle undefined routes (this must go AFTER all route handlers)
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `err handler can't find ${req.originalUrl} on this server!`,
      404,
    ),
  );
});

// ======================================
// #: Global Error Handling Middleware (in controllers/errorController.js)
// ======================================

app.use(globalErrorHandler);

// ======================================
// moved to be refactored in controllers/errorController.js
// ======================================

// app.use((err, req, res, next) => {
//   console.log(err.stack); // DEBUG:

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'err';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });
// ======================================
// #: SERVER: server.js >>
// ======================================

module.exports = app;
