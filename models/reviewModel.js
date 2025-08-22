const mongoose = require('mongoose');

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
  this.populate({
    path: 'tour',
    select: 'name', // include field
  }).populate({
    path: 'user',
    select: 'name photo', // include fields
  });

  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
