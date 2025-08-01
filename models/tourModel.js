const mongoose = require('mongoose');

const slugify = require('slugify');

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
    slug: String,
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
  // #: Insert Obj schema option to virtual property
  // 2. Implement it inside tourSchema(.schema)
  {
    toJSON: { virtuals: true }, // to confirm when the data is output to JSON.
    toObject: { virtuals: true }, // also when the data is output as Obj.
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

// ======================================
// #: Document Middleware
// Note on .save() middleware
// It ONLY runs before when using .save() and .create() commands
// Does not run on .updateOne(), insertMany() or .findByIdAndUpdate()!
// ======================================

tourSchema.pre('save', function (next) {
  // 'this' refers to the document being saved
  this.slug = slugify(this.name, { lower: true });
  console.log('Document middleware: Will save document...');
  next(); // move to next middleware
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
