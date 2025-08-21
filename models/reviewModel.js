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

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
