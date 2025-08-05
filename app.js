const express = require('express');

const morgan = require('morgan');

// const sanitizeQuery = require('./middleware/sanitizeQuery'); // clean query parameters in G scope

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
// ======================================
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// ======================================
// #: MIDDLEWARES
// ======================================
// console.log('NODE_ENV:', process.env.NODE_ENV); // DEBUG: Check, which ENV it's running on!
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
// app.use(sanitizeQuery);
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
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
      `Refactored err handler can't find ${req.originalUrl} on this server!`,
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
