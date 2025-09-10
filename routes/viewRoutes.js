// routes/viewRoutes.js = is the bridge between frontend pages (Pug views) and Express server.
// It’s an Express Router dedicated to rendering frontend Pug templates.
// Unlike the API routes (which send JSON), these routes render HTML.
// Example:
// / → calls viewController.getOverview → renders overview.pug
// /tours/:slug → calls viewController.getTour → renders tour.pug

const express = require('express');
const viewController = require('../controllers/viewController');

const authController = require('../controllers/authController'); // authController.isLoggedIn - Check Token

const router = express.Router();

// getAccount needs protect controller
// router.use(authController.isLoggedIn); // removed to avoid double req on getAccount

router.get('/', authController.isLoggedIn, viewController.getOverview);
router.get('/tours/:slug', authController.isLoggedIn, viewController.getTour);
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
// getAccount needs clear check on both JWT token and cookies
router.get('/me', authController.protect, viewController.getAccount);

module.exports = router;
