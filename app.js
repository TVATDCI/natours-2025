const express = require('express');

const morgan = require('morgan');

const sanitizeQuery = require('./middleware/sanitizeQuery');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// #: MIDDLEWARES
// console.log('NODE_ENV:', process.env.NODE_ENV); // DEBUG: Check, which ENV it's running on!
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(sanitizeQuery);
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the custom MIDDLEWARES 😸');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// #: Mounted Routers from routes/ to the base path
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// #: SERVER: server.json

module.exports = app;
