const express = require('express');

const morgan = require('morgan');

// const sanitizeQuery = require('./middleware/sanitizeQuery'); // clean query parameters in G scope

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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
// #Operational Error handler
// ======================================
app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on this server!`,
  //   });

  const err = new Error(`Can't find ${req.originalUrl} on this server!!`);
  err.status = 'fail';
  err.statusCode = 404;

  next(err);
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'err';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
// ======================================
// #: SERVER: server.js >>
// ======================================

module.exports = app;
