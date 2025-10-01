const express = require('express');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
// const sanitizeQueryMiddleware = require('./sanitizeQuery');
// const sanitizeHtmlMiddleware = require('./sanitizeHtml');

const securityMiddleware = express.Router();

securityMiddleware.use(express.json({ limit: '10kb' }));
securityMiddleware.use(express.urlencoded({ extended: true, limit: '10kb' }));
securityMiddleware.use(cookieParser());
securityMiddleware.use(mongoSanitize());
securityMiddleware.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
      'rating',
    ],
  }),
);
// securityMiddleware.use(sanitizeQueryMiddleware);
// securityMiddleware.use(sanitizeHtmlMiddleware);

module.exports = securityMiddleware;
