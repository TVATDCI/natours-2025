const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const sanitizeQueryMiddleware = require('./sanitizeQuery');
const sanitizeHtmlMiddleware = require('./sanitizeHtml');

const securityMiddleware = express.Router();

const csrfProtection = csrf({ cookie: true });

securityMiddleware.use(express.json({ limit: '10kb' }));
securityMiddleware.use(express.urlencoded({ extended: true, limit: '10kb' }));
securityMiddleware.use(cookieParser());
securityMiddleware.use(csrfProtection);

securityMiddleware.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
  next();
});

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
securityMiddleware.use(sanitizeQueryMiddleware);
securityMiddleware.use(sanitizeHtmlMiddleware);

module.exports = securityMiddleware;
