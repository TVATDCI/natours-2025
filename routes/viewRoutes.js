const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewController.alerts);

// Overview and tour detail pages: visible to everyone, but show different header if logged in
router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);

// Login form: if already logged in, header will reflect it
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);

// signup form:
router.get('/signup', viewController.getSignupForm);

// Account page: must be logged in → strict protection required
router.get('/me', authController.protect, viewController.getAccount);

// Account page: logged in user can query bookings and see their booked tours
router.get('/my-tours', authController.protect, viewController.getMyTours);

module.exports = router;
