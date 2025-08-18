const express = require('express');

const cookieParser = require('cookie-parser');

const morgan = require('morgan');
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
// console.log('NODE_ENV:', process.env.NODE_ENV); // DEBUG: Check, which ENV it's running on!
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==== Limit 100 requests from the same IP in 1 Hour ====

const limiter = rateLimit({
  max: 100, // max number of requests depends on project perspective
  windowMs: 60 * 60 * 1000, // 1 hour window
  message: 'Too many requests from this IP, please try again in an hour!',
});

// NOTE: Apply to all routes starting with /api
app.use('/api', limiter);

app.use(express.json());

// Cookie parser — parses cookies from incoming requests into req.cookies
app.use(cookieParser());
// app.use(sanitizeQuery);
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers); // req. http header in express
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
