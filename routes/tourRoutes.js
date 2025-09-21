const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router(); // modular router

// ===================================================================
// # tours reviews ROUTES - check double block of code in reviewRoutes
// Solution: removed this code and go into merging params!
// ===================================================================
// Redirect any /:tourId/reviews to reviewRouter because it is using the same block of code!
router.use('/:tourId/reviews', reviewRouter);

// ===================================================================
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
// =======================================================================
// Geospatial Queries Finding Tours Within Radius!
// GET /api/v1/tours/tours-within/100/center/34.111745,-118.113491/unit/mi
// =======================================================================
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'guide', 'lead-guide'),
    tourController.getMonthlyPlan,
  ); // add URL params to define the year

router
  .route('/') // root(/api/v1/tours)
  .get(tourController.getAllTours) //
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  ); // Create a new tour. checkBody is removed!

router
  .route('/:id')
  .get(tourController.getTour) // Get a single tour by ID
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  ) // Update a specific tour
  .delete(
    authController.protect, // must logged in
    authController.restrictTo('admin', 'lead-guide'), // admin or lead-guide only
    tourController.deleteTour,
  ); // Delete a specific tour

module.exports = router;
