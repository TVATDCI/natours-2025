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
      maxlength: [40, 'A tour name must have less or equal than 40 characters'], // tourController/line: 161 (runValidators: true)
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
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
      min: [1, 'Rating must must be above 1.0'],
      max: [5, 'Rating must must be below 5.0'],
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
    secretTour: {
      // QUERY MIDDLEWARE
      type: Boolean,
      default: false,
    },
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
// #: Document Middleware (.save() & .create() only)
// Note: Does NOT run on updateOne(), findByIdAndUpdate(), or insertMany()
// Remember to define: slug: String in the schema!
// ======================================

// ======================================
// PRE-SAVE HOOK — generate slug from tour name
// ======================================
tourSchema.pre('save', function (next) {
  // 'this' refers to the document being saved
  this.slug = slugify(this.name, { lower: true });
  // console.log('Document middleware: Will save document with .slug...');
  next();
});

// ======================================
// PRE-SAVE HOOK — extra logging or prep work
// ======================================
// tourSchema.pre('save', function (next) {
//   console.log('Document middleware: Will save document ...');
//   next();
// });

// ======================================
// POST-SAVE HOOK — runs after doc is saved in DB
// ======================================
// tourSchema.post('save', function (doc, next) {
//   console.log('Document middleware: Saved document:', doc);
//   next();
// });

// ======================================
// QUERY MIDDLEWARE
// ======================================
// tourSchema.pre('find', function (next){}
// /^find/: Regex matches find, findOne, findOneAndUpdate, OR /^find/ = all start with find
// .pre('find'): Runs before any .find() query is executed.(tourController.js/line: 25)
tourSchema.pre(/^find/, function (next) {
  console.log('Query middleware: About to execute a find operation...');
  //this.find({ secretTour: { $ne: true } }); // $ne= not equal to true - exclude secret tours. Now it is a secrete!
  console.log(
    'secretTour is now set to true: now it i a secrete not there if you look for it...',
  );

  this.start = Date.now(); // just for measuring query time (optional)
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // DEBUG:
  console.log(`Query took ${Date.now() - this.start} ms`);

  // DEBUG:
  //  console.log(`Returned ${docs.length} documents`);
  next();
});

// ======================================
// AGGREGATION MIDDLEWARE
// ======================================
// This middleware runs before any aggregation pipeline is executed on the Tour model.
// It is used to automatically exclude secret tours from all AGGREGATION!
// ======================================

tourSchema.pre('aggregate', function (next) {
  console.log('Aggregation middleware: Specify Pipeline...');

  // STEP: Exclude secret tours in all aggregations unless already handled
  // Adds a $match stage to the beginning of the aggregation pipeline
  // This filters out secret tours (secretTour: true), so they won't appear in aggregations by default
  // unshift() is used to make sure this is the FIRST stage in the pipeline
  //this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  // DEBUG:
  console.log(this.pipeline());

  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
