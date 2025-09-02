// ======================================
// #: DEPENDENCIES
// ======================================
const path = require('path');
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
const reviewRouter = require('./routes/reviewRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// ======================================
// 1) VIEW ENGINE - SET UP PUG IN EXPRESS
// ======================================

// Telling Express that we’ll use Pug as our template engine
app.set('view engine', 'pug');

// Define where the views (templates) live
app.set('views', path.join(__dirname, 'views'));

// ======================================
// #: GLOBAL MIDDLEWARES
// ======================================

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

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
      'rating',
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
// 2) SERVING STATIC FILES & DEBUGGING
// ======================================
// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Debugging: attach request time + log headers
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers); // DEBUG
  next();
});

// ======================================
// 3) ROUTES
// ======================================
// Use the base.pug template inside the views folder.
// Render it when the root (/) is accessed.
app.get('/', (req, res) => {
  // testing code 1:
  const user = { name: 'TVATDCI' };
  const tours = [
    { name: 'The Forest Hiker', duration: 5, price: 497 },
    { name: 'The Sea Explorer', duration: 7, price: 997 },
  ];
  res
    .status(200)
    .render('base', { user, tours, sampleTour: 'The Forest Hiker' });
});

app.get('/overview', (req, res) => {
  // testing code 2:
  res.status(200).render('overview', { title: 'All Tours' });
});

app.get('/tour', (req, res) => {
  // testing code 3:
  res.status(200).render('tour', { title: 'The Forest Hiker Tour' });
});

// ======================================

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
