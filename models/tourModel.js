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
      maxlength: [40, 'A tour name must have <= 40 characters'],
      minlength: [10, 'A tour name must have >= 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain character'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be either: easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.ceil(val * 10) / 10,
      // Example: 4.3333 * 10 = 43.333 → ceil = 44 → 4.4
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
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
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
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    secretTour: {
      // QUERY MIDDLEWARE
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON requires a "type" and "coordinates" in the Object.
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      // [1st longitude, 2nd latitude], expected to be an array of number!
      coordinates: [Number],
      address: String,
      description: String,
    },
    // Create a new document as an array of object inside the parent document (tour)
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        description: String,
        day: Number, // Day of the tour when this location is visited
      },
    ],
    // ========================================================================================
    // Model Tour Guides (Embedding Code). It will only create new object document in tourModel
    // guides: Array,
    // ========================================================================================
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Reference to the User model
      },
    ],
  },
  {
    toJSON: { virtuals: true }, // to confirm when the data is output to JSON.
    toObject: { virtuals: true }, // also when the data is output as Obj.
  },
);

// ================
// 🔹 Index on slug
// ================
tourSchema.index({ slug: 1 });

// ==========================================
// 🔹 Compound index (price + ratingsAverage)
// ==========================================
tourSchema.index({ price: 1, ratingsAverage: -1 });

// ================================================
// 🔹 Geospatial index
// ================================================
tourSchema.index({ startLocation: '2dsphere' });

// ===================
// #: Virtual Property
// ===================
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// ====================
// #: Virtual populates
// ====================

// ===============================================
// Use virtual populate to Connect Tour → Reviews.
// ===============================================
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// =======================================================
// EXTRA: Use virtual populate to Connect Tour → Bookings
// =======================================================
tourSchema.virtual('bookings', {
  ref: 'Booking',
  foreignField: 'tour',
  localField: '_id',
});

// =================================================
// #: Document Middleware (.save() & .create() only)
// =================================================

// ============================================
// PRE-SAVE HOOK — generate slug from tour name
// ============================================
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// ====================
// PRE-QUERY MIDDLEWARE
// ====================
tourSchema.pre(/^find/, function (next) {
  // console.log('Query middleware: About to execute a find operation...');
  this.find({ secretTour: { $ne: true } }); // $ne= not equal to true - exclude secret tours. Now it is a secrete!
  // secretTour is now set to true: now it i a secrete not there if you look for it...uncomment this line to see it!

  this.start = Date.now(); // just for measuring query time (optional)
  next();
});

// =======================================
// Auto-populate guides (Query Middleware)
// =======================================
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt', // exclude fields
  });

  next();
});

// ======================
// POST-QUERY MIDDLEWARE
// ======================
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms`); // ms = milliseconds!

  //  console.log(`Returned ${docs.length} documents`);
  next();
});

// =======================
// AGGREGATION MIDDLEWARE
// =======================

tourSchema.pre('aggregate', function (next) {
  // console.log('Aggregation middleware: Specify Pipeline...');
  // STEP: Exclude secret tours in all aggregations unless already handled
  if (!(this.pipeline()[0] && this.pipeline()[0].$geoNear)) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  }

  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
