const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const globalsMiddleware = express.Router();

const parseAdditionalConnectSources = () => {
  const configuredSources = process.env.CSP_CONNECT_SRC;

  if (!configuredSources) return [];

  return configuredSources
    .split(',')
    .map((source) => source.trim())
    .filter(Boolean);
};

const connectSrc = [
  "'self'",
  ...parseAdditionalConnectSources(),
  'https://*.tile.openstreetmap.org',
  'https://*.basemaps.cartocdn.com',
  'https://api.stripe.com',
  'https://q.stripe.com',
  'https://hooks.stripe.com',
];

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
        'https://res.cloudinary.com',
      ],
      connectSrc: [...new Set(connectSrc)],
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
