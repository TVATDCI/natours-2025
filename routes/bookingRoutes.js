const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// Remove protect single route to protect all routes after this middleware (216)
router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

// restrict administration routes to admins and lead-guild

router.use(authController.restrictTo('admin', 'lead-guide'));

// These routes (in user account.pug) can be seen by admins and lead-guild only
router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
