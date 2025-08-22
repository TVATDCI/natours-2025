const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

// Routes
router
  .route('/')
  .get(reviewController.getAllReviews) // = /api/v1/reviews
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview,
  ); // = /api/v1/reviews → create a review (review, tour, user are required in (reviewModel)

module.exports = router;
