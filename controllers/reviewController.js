// controllers/reviewController.js
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// ======================================
// Always ensure req.body has tour & user for nested routes
// ======================================
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  // Never trust client-sent user; take it from auth
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// ======================================
// CRUD via generic factory
// ======================================
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
// =================================================
// exports.createReview = factory.createOne(Review);
// =================================================
// NOTE: How Jonas does it on his github official page. BUT not until now. He knows how it will happen!
// Single Responsibility: He doesn’t write custom logic for update/delete inside the controller.
// Ownership Checks: Rather than custom code, he configures Mongoose schema to prevent duplicate reviews per user per tour using a compound index.
// Cleaner Controllers: All the CRUD logic is handled by a generic handlerFactory, keeping controllers extremely clean.
// Methods
// setTourUserIds middleware: Ensures the user is always taken from the authenticated user—not from client input. You’re already matching this—nice work!
// Factory handlers: He leverages createOne, updateOne, deleteOne, etc., from handlerFactory to avoid repeating similar logic across controllers.

// NOTE: Comparison:
// Jonas's approach → keep controllers thin, centralize all special cases into errorController.js + handlerFactory.js.
// My current approach → keep review-specific logic (ownership, duplicate review restriction, etc.) inside reviewController.js.
// And honestly, I want to be cautious here. Jonas “claims” all is done by putting protect + restrictTo in reviewRoutes, but:
// That only protects authentication + role-based access.
// It does not handle ownership (user === review.user) or duplicate prevention — those are business rules, not just auth rules.
// So what i am doing — keeping strict, review-specific checks in reviewController — makes the system safer and clearer.

// Jonas does it later so he can show:
// 1. How to catch all Mongo duplicate key errors (11000) in one place.
// 2. Map them to a generic “Duplicate field value” → 400.
// - (He doesn’t adapt it for reviews specifically, so it’s less strict than yours.)
// 3. Keep controller code slim, but less tailored to each business rule.

// It’s “clean” in the sense of less code duplication, but it does mean less precision in error handling unless you extend it.

// a beginner

// ================================================================
// NOTE: I DON'T. This is how i check for review ownership i come up with for now.
// ================================================================
// When creating, force the user field to come from req.user.id, not from req.body.
// exports.createReview = catchAsync(async (req, res, next) => {
//   // Ensure tour and user are set correctly
//   if (!req.body.tour) req.body.tour = req.params.tourId;
//   req.body.user = req.user.id; // 🔒 secure: override whatever client sends

//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });
// ======================================
// Create Review with duplicate key error MongoDB (11000) convert to 403 Forbidden!
// ======================================
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
          // 403 Forbidden → user is authenticated but not allowed to do this.
        ),
      );
    }
    return next(err); // all other errors as usual
  }
});

// exports.updateReview = factory.updateOne(Review);
// exports.deleteReview = factory.deleteOne(Review);

// PATCH /api/v1/reviews/:id
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // console.log('Review.user:', review.user);
  // console.log('Review.user.id:', review.user.id);
  // console.log('req.user.id:', req.user.id);

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
