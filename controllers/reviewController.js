// controllers/reviewController.js
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
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
// Ownership guard for update/delete
// Allows: owner OR admin
// ======================================

// exports.checkReviewOwnership = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id);

//   if (!review) {
//     return next(new AppError('No review found with that ID', 404));
//   }

//   // Get the actual user ID (works for populated or non-populated)
//   const ownerId = review.user._id
//     ? review.user._id.toString()
//     : review.user.toString();

//   console.log({
//     ownerId,
//     currentUser: req.user.id,
//     role: req.user.role,
//   });

//   if (ownerId !== req.user.id && req.user.role !== 'admin') {
//     return next(
//       new AppError('You do not have permission to perform this action', 403),
//     );
//   }

//   next();
// });

// ======================================
// CRUD via generic factory
// ======================================
exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
// exports.createReview = factory.createOne(Review);
exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
