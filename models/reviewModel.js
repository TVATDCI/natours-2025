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

// ======================================================
// Preventing Duplicate Reviews
// - Each user can only leave one review per tour.
// - If they try to post another review on the same tour,
// block it (or optionally update the old one).
// ======================================================
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// ====================
// PRE-QUERY MIDDLEWARE
// ====================
reviewSchema.pre(/^find/, function (next) {
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

  // console.log(stats);

  // Update the Tour with new stats
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // If all reviews were deleted, reset to default
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// ===================================
// Middleware for newly created Review
// ===================================
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

// =====================================================
// Pre middleware for findOneAndUpdate, findOneAndDelete
// =====================================================
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.clone().findOne();
  // console.log(this.r);
  next();
});

// =======================================================
// Post middleware for findOneAndUpdate / findOneAndDelete
// =======================================================
reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    await this.r.constructor.calcAverageRatings(this.r.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
