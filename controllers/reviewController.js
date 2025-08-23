const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
// exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

// exports.getAllReviews = catchAsync(async (req, res, next) => {
// let filter = {};
// implementing filter for all review of each tour with tourId.
// Check (filter) if there is tourId in the req. Then, put the object into the filter
// if (req.params.tourId) filter = { tour: req.params.tourId };

// Option:
// If the request came from /tours/:tourId/reviews, then only return reviews for that tour
// With ternary opt: This way is more concise than declaring let filter = {} and updating later!
//   const filter = req.params.tourId ? { tour: req.params.tourId } : {};

//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

// =================================================================
exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes: if tourId is in params, use it
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id; // if authentication is done

  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

// // ==================================================================

// // additional info for reviewWithTour info!
// exports.getReviewWithTour = catchAsync(async (req, res, next) => {
//   const review = await Review.findById(req.params.id).populate({
//     path: 'tour',
//     select: 'name',
//   });
//   res.status(200).json({ status: 'success', data: { review } });
// });
