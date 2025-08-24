const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

const factory = require('./handlerFactory');

// =================================================================

exports.getAllReviews = factory.getAll(Review);

// =================================================================

exports.getReview = factory.getOne(Review);

// =================================================================
// Middleware to set tour and user IDs for nested routes
// reviewController.setTourUserIds, must be added before createReview in reviewRoutes
// Allow nested routes: if tourId is in params
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);

// =================================================================

exports.updateReview = factory.updateOne(Review);

// =================================================================

exports.deleteReview = factory.deleteOne(Review);

// =================================================================

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});
