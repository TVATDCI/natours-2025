const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); // Set to true merging param for both reviews from POST /tours, POST /reviews

// Routes
router
  .route('/')
  .get(reviewController.getAllReviews) // = /api/v1/reviews
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  ); // = /api/v1/reviews → create a review (review, tour, user are required in (reviewModel)

router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
