const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const globalsMiddleware = express.Router();

// Logging in dev mode
if (process.env.NODE_ENV === 'development') {
  globalsMiddleware.use(morgan('dev'));
}

// Secure HTTP headers
globalsMiddleware.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        'https://cdnjs.cloudflare.com',
        'https://js.stripe.com',
      ],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      imgSrc: [
        "'self'",
        'data:',
        'blob:',
        'https://*.tile.openstreetmap.org',
        'https://*.basemaps.cartocdn.com',
      ],
      connectSrc: [
        "'self'",
        'https://*.tile.openstreetmap.org',
        'https://*.basemaps.cartocdn.com',
        'https://api.stripe.com',
        'https://q.stripe.com',
      ],
      frameSrc: [
        "'self'",
        'https://js.stripe.com',
        'https://hooks.stripe.com',
        'https://checkout.stripe.com',
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  }),
);

module.exports = globalsMiddleware;
