const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// ========================================================
// Always ensure req.body has tour & user for nested routes
// ========================================================
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  // Never trust client-sent user; take it from auth
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// =========================
// CRUD via generic factory
// =========================
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
// ================================================================================
// Create Review with duplicate key error MongoDB (11000) convert to 403 Forbidden!
// ================================================================================
exports.createReview = catchAsync(async (req, res, next) => {
  // Ensure tour and user are set correctly
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user.id; // 🔒 secure: override client input

  try {
    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { review: newReview },
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key → user already has a review
      return next(
        new AppError(
          'a user/1 review/tour. You have already reviewed this tour',
          403,
        ),
      );
    }
    return next(err);
  }
});

// PATCH /api/v1/reviews/:id
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Check ownership (or admin)
  if (review.user.id !== req.user.id && req.user.role !== 'admin') {
    return next(
      new AppError(
        'You do not have permission to perform this action and bla bla',
        403,
      ),
    );
  }

  // Now update
  review.review = req.body.review || review.review;
  review.rating = req.body.rating || review.rating;
  await review.save();

  res.status(200).json({
    status: 'success',
    data: { review },
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  // Build a single ownership filter
  const filter =
    req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user.id };

  const review = await Review.findOneAndDelete(filter);

  if (!review) {
    return next(
      new AppError(
        'No review found with that ID or you are not authorized',
        403,
      ),
    );
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
