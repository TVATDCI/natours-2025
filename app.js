// ======================================
// #: DEPENDENCIES
// ======================================
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const sanitizeQueryMiddleware = require('./middleware/sanitizeQuery');
const sanitizeHtmlMiddleware = require('./middleware/sanitizeHtml');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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

// Rate limiting: Limit 100 requests per IP per hour (applies to /api routes)
const limiter = rateLimit({
  max: 100, // limit each IP
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// ======================================
// #: SECURITY & SANITIZATION MIDDLEWARES
// ======================================
// Body parser, reading data from body (limit payload to 10kb) to req.body
app.use(express.json({ limit: '10kb' }));
// ======================================
// Cookie parser: parses cookies into req.cookies
app.use(cookieParser());
// ======================================
// Data sanitization against NoSQL query injection
// mongoSanitize → protects from NoSQL injection ($gt, $ne, etc.).
app.use(mongoSanitize());
// ======================================
// Data sanitization against HTTP Parameter Pollution
// hpp → prevents duplicate param exploitation, pollution, allow certain whitelisted params
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);
// ======================================
// Query sanitization
// sanitizeQueryMiddleware → cleans query params & enforces what’s allowed.
app.use(sanitizeQueryMiddleware); // Query sanitization
// ======================================
// Data sanitization against XSS
// sanitizeHtmlMiddleware → protects from XSS / HTML injection.
app.use(sanitizeHtmlMiddleware);
// ======================================

// ======================================
// #: STATIC FILES & DEBUGGING
// ======================================

// Serve static files from public folder
app.use(express.static(`${__dirname}/public`));

// Debugging: attach request time + log headers
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers); // DEBUG
  next();
});

// ======================================
// #: ROUTES
// ======================================

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// ======================================
// #: GLOBAL ERROR HANDLER
// ======================================

app.use(globalErrorHandler);

module.exports = app;
// ======================================
// #: SERVER: server.js >>
// ======================================
