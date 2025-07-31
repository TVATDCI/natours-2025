const mongoose = require('mongoose');

// ======================================
// #: tourSchema / Obj. schema definitions
// ======================================

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: String,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a group difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now, // NOT Date.now()
      select: false, // exclude(select) field(createdAt) from the schema(false)
    },
    startDates: [Date],
  },
  // #: Obj schema option to virtual property
  // 2. Implement it inside tourSchema(.schema)
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ======================================
// #: Virtual Property
// ======================================

// NOTE: ARROW functions (=>) CAN NOT be used here because `this` keyword won't refer to the document.
// So regular function in this case.
// 1. Define virtual property in tourSchema(.schema)

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
