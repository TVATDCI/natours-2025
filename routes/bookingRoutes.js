const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// Remove protect single route to protect all routes after this middleware (216)
router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

// restrict administration routes to admins and lead-guild

router.use(authController.restrictTo('admin', 'lead-guide'));

module.exports = router;
