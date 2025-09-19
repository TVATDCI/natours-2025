// routes/viewRoutes.js
// ====================
// This router connects frontend pages (Pug templates) with the Express server.
// Unlike API routes (which return JSON), these routes render full HTML views.
// Each route typically:
//   1. Optionally checks login status (authController.isLoggedIn) → non-blocking
//   2. Calls a viewController method → renders the corresponding Pug template
//
// Key difference between middleware:
//   - authController.isLoggedIn → runs on public pages, checks cookie/JWT quietly.
//       • Does NOT throw an error if no/invalid token.
//       • Simply sets res.locals.user if a logged-in user exists (used in header.pug).
//   - authController.protect → strict guard for protected pages.
//       • Throws 401 if no/invalid token.
//       • Use this for pages where the user must be authenticated (like /me).
//
// NOTE: isLoggedIn = "soft check for rendering", protect = "hard check for access".
// SOLUTION: Use authController.protect → strict guard for protected pages. Authenticated user only!

const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

// Overview and tour detail pages: visible to everyone, but show different header if logged in
router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.isLoggedIn,
  viewController.getOverview,
);
router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);

// Login form: if already logged in, header will reflect it
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);

// Account page: must be logged in → strict protection required
router.get('/me', authController.protect, viewController.getAccount);

// Account page: logged in user can query bookings and see their booked tours
router.get('/my-tours', authController.protect, viewController.getMyTours);

module.exports = router;
