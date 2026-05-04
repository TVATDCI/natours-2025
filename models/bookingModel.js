// models/bookingModel.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!'],
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price.'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  paid: {
    type: Boolean,
    default: true, // initially assume booking is paid (simplified)
  },
  stripeEventId: {
    type: String,
  },
});

bookingSchema.index({ stripeEventId: 1 }, { unique: true, sparse: true });

// Pre-middleware Auto-populate references whenever there is a query
// Keep user data available by default, but require explicit tour population.
bookingSchema.pre(/^find/, function (next) {
  this.populate('user');
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
