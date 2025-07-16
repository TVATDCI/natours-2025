const express = require('express');

// declare and define the Routers before mounting!
// logic: create routers for all routes and turn them into mini Express apps then mount them into the ROUTER below!
const router = express.Router(); // modular router

router
  .route('/') // root(/api/v1/tours)
  .get(getAllTours) // Get all tours
  .post(createTour); // Create a new tour

router
  .route('/:id')
  .get(getTour) // Get a single tour by ID
  .patch(updateTour) // Update a specific tour
  .delete(deleteTour); // Delete a specific tour

module.exports = router;
