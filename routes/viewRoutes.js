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

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tours/:slug', viewController.getTour);
router.get('/login', viewController.getLoginForm);

module.exports = router;
