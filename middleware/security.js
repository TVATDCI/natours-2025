const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const sanitizeQueryMiddleware = require('./sanitizeQuery');
const sanitizeHtmlMiddleware = require('./sanitizeHtml');

const securityMiddleware = express.Router();

const csrfProtection = csrf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    sameSite: 'strict',
  },
});

securityMiddleware.use(express.json({ limit: '10kb' }));
securityMiddleware.use(express.urlencoded({ extended: true, limit: '10kb' }));
securityMiddleware.use(cookieParser());

securityMiddleware.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();

  csrfProtection(req, res, (err) => {
    if (err) {
      console.error('SECURITY: CSRF middleware error', {
        path: req.path,
        method: req.method,
        message: err.message,
        code: err.code,
      });
    }
    next();
  });
});

securityMiddleware.use((req, res, next) => {
  try {
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : '';
  } catch (err) {
    console.error('SECURITY: Failed to generate CSRF token', {
      path: req.path,
      message: err.message,
    });
    res.locals.csrfToken = '';
  }
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