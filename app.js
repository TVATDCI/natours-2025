// ================
// #: DEPENDENCIES
// ================
const path = require('path');
const express = require('express');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const bookingController = require('./controllers/bookingController');
const corsMiddleware = require('./middleware/corsMiddleware');

const globalsMiddleware = require('./middleware/globalMiddlewares');
const securityMiddleware = require('./middleware/security');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');

const viewRouter = require('./routes/viewRoutes');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

// =============================================
// 1) VIEW ENGINE - SET UP PUG ENGINE IN EXPRESS
// =============================================
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// =======================================================
// #: GLOBAL MIDDLEWARES - middleware/globalMiddlewares.js
// =======================================================
app.use(globalsMiddleware);

// =======================================================
// Tell Express to trust the proxy Render, etc.
// =======================================================
app.set('trust proxy', 1);
// ==========================================================================
// Rate limiting: Limit 100 requests per IP per hour (applies to /api routes)
// ==========================================================================
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  max: 10,
  windowMs: 15 * 60 * 1000,
  message:
    'Too many auth attempts from this IP, please try again after 15 minutes!',
  skipSuccessfulRequests: true,
});
app.use('/api/v1/users/signup', authLimiter);
app.use('/api/v1/users/login', authLimiter);
app.use('/api/v1/users/forgotPassword', authLimiter);

// =============================================
// Apply CORS from corsMiddlewares.js
// =============================================
app.use(corsMiddleware);

// ==================================================================================
// Webhook must be above BEFORE use(express.json(), wrapped inside securityMiddleware
// ==================================================================================
// No need for body-parser(bodyParser). express raw will do the job
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  bookingController.webhookCheckout,
);
// ===============================================================
// #: SECURITY & SANITIZATION MIDDLEWARES - middleware/security.js
// ===============================================================
app.use(securityMiddleware);

// ===========================================================================
// 2) SERVING STATIC FILES & DEBUGGING - Serve static files from public folder
// ===========================================================================
app.use(express.static(path.join(__dirname, 'public')));

// ===========================================================================================
// Compressing all the text after static content that is sent to client but only in production
// ===========================================================================================
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
}

// Test: attach request time + log headers
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //  console.log(req.cookies);
  //  console.log(req.headers);
  next();
});

// ==========
// 3) ROUTES
// ==========
app.use('/', viewRouter);
// ======================================
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// =======================
// Handle undefined routes
// =======================
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// =======================
// #: GLOBAL ERROR HANDLER
// =======================

app.use(globalErrorHandler);

module.exports = app;
// ========================
// #: SERVER: server.js >>
// ========================
