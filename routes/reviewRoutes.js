const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); // Set to true merging param for both reviews from POST /tours, POST /reviews

// Protect all routes after this middleware
router.use(authController.protect);

// Routes
router
  .route('/')
  .get(reviewController.getAllReviews) // = /api/v1/reviews
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  ); // = /api/v1/reviews → create a review (review, tour, user are required in (reviewModel)

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    // reviewController.checkReviewOwnership,
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    // reviewController.checkReviewOwnership,
    reviewController.deleteReview,
  );

module.exports = router;
