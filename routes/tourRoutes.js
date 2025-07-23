const express = require('express');
const tourController = require('../controllers/tourController');
const sanitizeQuery = require('../middleware/sanitizeQuery');

// declare and define the Routers before mounting!
// logic: create routers for all routes and turn them into mini Express apps then mount them into the ROUTER below!
const router = express.Router(); // modular router

// Param MIDDLEWARES to check the id
// Register param middleware from tourController
// router.param('id', tourController.checkID);

router
  .route('/') // root(/api/v1/tours)
  .get(sanitizeQuery, tourController.getAllTours) // Get all tours
  .post(tourController.createTour); // Create a new tour. checkBody is removed!

router
  .route('/:id')
  .get(tourController.getTour) // Get a single tour by ID
  .patch(tourController.updateTour) // Update a specific tour
  .delete(tourController.deleteTour); // Delete a specific tour

module.exports = router;

/**
 * Avoiding repeating tourController by destructuring Object method! DRY 
 * I would!
 * const express = require('express');
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour
} = require('../controllers/tourController');

const router = express.Router();

router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
  
 */
