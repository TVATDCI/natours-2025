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

// ================================================================
// NOTE: I DON'T. This is how i check for review ownership i come up with for now.
// ================================================================
// When creating, force the user field to come from req.user.id, not from req.body.
exports.createReview = catchAsync(async (req, res, next) => {
  // Ensure tour and user are set correctly
  if (!req.body.tour) req.body.tour = req.params.tourId;
  req.body.user = req.user.id; // 🔒 secure: override whatever client sends

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

// exports.updateReview = factory.updateOne(Review);
// exports.deleteReview = factory.deleteOne(Review);

// PATCH /api/v1/reviews/:id
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  console.log('Review.user:', review.user);
  console.log('Review.user.id:', review.user.id);
  console.log('req.user.id:', req.user.id);

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

// DELETE /api/v1/reviews/:id
// exports.deleteReview = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id);

//   if (!review) {
//     return next(new AppError('No review found with that ID', 404));
//   }

//   // Check ownership (or admin)
//   if (review.user.id !== req.user.id && req.user.role !== 'admin') {
//     return next(
//       new AppError('You do not have permission to perform this action', 403),
//     );
//   }

//   await review.deleteOne();

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

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
