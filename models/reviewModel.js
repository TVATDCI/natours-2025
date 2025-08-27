const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // NOTE: This is Parent Referencing → Review is the child, and it points up to its parents.
    // The Review document stores the reference IDs of those parents.
    // Each Review belongs to exactly one Tour and one User. It holds ID of parent Tour + parent User
    tour: {
      // Parent referencing: each review knows which tour it belongs to
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      // Parent referencing: each review knows which user wrote it
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    // This allows virtual properties when data is outputted as JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ======================================
// PRE-QUERY MIDDLEWARE
// ======================================
// Watch out Double .populate() in one document(this)

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name', // include field
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo', // include fields
  //   });

  //   next();
  // });
  // If only the user info is needed, remove tour populate entirely from middleware and add it only when necessary in the controller (reviewController/getReviewWithTour)
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// ============================
// Calculating Average on Tours
// ============================
// Static methods in Mongoose → belong to the Model (Review) itself, not an instance.
// ============================
// Push the review stats up into the Tour model (Tour Stats Aggregation - getTourStats) through (tourId) and attach to calcAverageRatings
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }, // Match all reviews for a given tour
    },
    {
      $group: {
        _id: '$tour', // group by tour _id
        nRating: { $sum: 1 }, // count of reviews
        avgRating: { $avg: '$rating' }, // average rating
      },
    },
  ]);

  console.log(stats);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};

// ============================
// Middleware for newly created Review
// ============================
reviewSchema.post('save', async function () {
  // this → current review document
  await this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
