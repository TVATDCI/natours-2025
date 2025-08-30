const mongoose = require('mongoose');

const slugify = require('slugify');

// const User = require('./userModel'); // Model Tour Guides (Embedding Code)

//const validator = require('validator');

// ======================================
// #: tourSchema / Obj. schema definitions
// ======================================

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // Built-in: field must be provided
      unique: true, // Ensures no duplicate names (not a validator, more of a DB constraint)
      trim: true, // Removes extra spaces
      maxlength: [40, 'A tour name must have <= 40 characters'], // Built-in validator
      minlength: [10, 'A tour name must have >= 10 characters'], // Built-in validator
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
      // Setter function runs each time ratingsAverage is set.
      // set: (val) => Math.round(val * 10) / 10,
      // Math.round goes to the nearest integer (4.3333 to to). If val * 10 = (43.333). Then 43.333 / 10 = 4.3
      // Or, If val(4.6666) * 10 = (46.666). Then 46.666 / 10 = 4.7
      // OPTIONAL: But beware: savvy users 😅
      // Math.ceil always rounds UP to the nearest tenth.
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
      // Custom validator to make sure the discount is always below the regular price
      // 'val' is the value entered for priceDiscount
      // 'this.price' refers to the regular price on the current document
      // Only works on document creation (e.g., Tour.create), not on updates
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
      // Correct Usage in Mongoose. It passes the function, not the result.
      // Mongoose will call the function each time a new document is created.
      // So each document gets its own unique creation timestamp
      default: Date.now,
      // NOT Date.now() will It sets the default value to the timestamp at the time the schema is defined,
      // not when the document is created. All documents will get the same timestamp
      select: false, // exclude(select) field(createdAt) from the schema(false)
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
      coordinates: [Number], // [1st longitude, 2nd latitude], expected to be an array of number!
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
    // NOTE: This is Child Referencing → Tour is the parent, Guides are the children.
    // The guides field is an array of references to User.
    // Guides in Tour: child referencing (Tour holds IDs of children).
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Reference to the User model
      },
    ],
  },
  // NOTE: Insert Obj schema option to virtual property
  // 2. Implement it inside tourSchema(.schema)
  {
    toJSON: { virtuals: true }, // to confirm when the data is output to JSON.
    toObject: { virtuals: true }, // also when the data is output as Obj.
  },
);

// ===========================================
// READING PERFORMANCE WITH INDEXES
// .explain can be to show how MongoDB actually executes your queries under the hood. (Indexes)
//const docs = await features.query.explain();
// ===========================================
// ================================================
// 🔹 Single-field index on price
// ================================================
// - Ascending index (1) means MongoDB stores prices sorted from cheapest → most expensive.
// - Helps queries like:
//     await Tour.find({ price: { $lt: 1000 } }).explain();
// - Example output in execution plan:
//     "stage": "IXSCAN", "keyPattern": { "price": 1 }
//     "executionStats": { "totalKeysExamined": 3, "totalDocsExamined": 3, "nReturned": 3 }
// - Notice: only 3 keys/docs scanned out of 9 total → very efficient!
//
// tourSchema.index({ price: 1 });

// ================================================
// 🔹 Index on slug
// ================================================
// - Makes lookups like `Tour.findOne({ slug })` very fast.
// - Especially useful when slugs are unique identifiers in URLs.
//
tourSchema.index({ slug: 1 });

// ================================================
// 🔹 Compound index (price + ratingsAverage)
// ================================================
// - Order matters here!
// - First sorts/filter by `price` (asc), then within same price bucket sorts by `ratingsAverage` (desc).
// - Example query it optimizes:
//     Tour.find().sort({ price: 1, ratingsAverage: -1 })
// - Without this compound index →
//   MongoDB would filter using `price` index, but then sort all matches in memory by `ratingsAverage` (slower).
//
tourSchema.index({ price: 1, ratingsAverage: -1 });

// ================================================
// 🔹 Geospatial index
// ================================================
// - Required for any $geoWithin, $geoNear queries on `startLocation`.
// - Supports queries like:
//     /tours-within/:distance/center/:latlng/unit/:unit
// - Must be declared as a '2dsphere' index for GeoJSON coordinates (lng, lat).
//
tourSchema.index({ startLocation: '2dsphere' });

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
// Use virtual populate to connect 2 models and then take it review id from tour field.
// ======================================
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // Specify the name of field (tour) to connect the 2 models = tour(in reviewSchema)
  localField: '_id', // Once connected take the id of the Review, which ius stored in tour field!
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
// Modelling Tour Guides (Embedding) -> switched to Child referencing (below)
// ======================================

// In this schema, `guides` is an array of IDs (ObjectId from User).
// Example POSTMAN payload when creating a tour:
// { "guides": ["68a654867e534e9dc3362b0a", "68a655907e534e9dc3362b0d"] }
//
// This pre-save hook runs BEFORE saving the new tour:
// 1. For each ID in `guides`, it fetches the full User document from the DB.
// 2. It then REPLACES the IDs with the actual User objects.
// → Effectively embedding the guide documents into the new Tour document.
//
// NOTE: This is ONLY to demonstrate the embedding approach. I will be commented out!
// In real-world apps, referencing (with populate()) is usually better.
// Because: If a User is updated (e.g. email), embedded copies won’t auto-sync across tours.
// Also, querying all guides on every save is inefficient at scale.

// tourSchema.pre('save', async function (next) {
//   // `this.guides` is currently an array of user IDs
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));

//   // Replace each ID with the full user document
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });
// ======================================
// Child Referencing
// ======================================
//
// For guides, Storing only their ObjectIds in the tour document.
// No need to import User model here (no: const User = require('./userModel')).
// Instead, define the field as:
//    type: mongoose.Schema.ObjectId
//    ref: 'User'
// This creates a reference directly to the User collection using only the user IDs to create objectIds. (Array of refIds 🤓)
//
// ✔️ Benefits:
// - No duplication → user data is stored only once in the users collection.
// - Consistency → if a user updates (e.g. email), it’s reflected everywhere automatically.
// - Flexible queries → fetch tours with guides (using .populate()), or just tours alone (faster).
//
//  Note: - Using .populate() runs an extra query behind the scenes → small performance cost.

// ======================================
// PRE-SAVE HOOK — extra logging or prep work
// ======================================
// tourSchema.pre('save', function (next) {:
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

// ======================================
// PRE-QUERY MIDDLEWARE
// ======================================
tourSchema.pre(/^find/, function (next) {
  console.log('Query middleware: About to execute a find operation...');
  this.find({ secretTour: { $ne: true } }); // $ne= not equal to true - exclude secret tours. Now it is a secrete!
  // secretTour is now set to true: now it i a secrete not there if you look for it...uncomment this line to see it!

  this.start = Date.now(); // just for measuring query time (optional)
  next();
});

// ======================================
// Auto-populate guides (Query Middleware)
// ======================================
//
// This middleware runs automatically before any find query
// (find, findOne, findById, etc.)
//
// It populates the `guides` field with user data
// and excludes sensitive/unnecessary fields.
// NOTE: This adds one extra query behind the scenes.

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt', // exclude fields
  });

  next();
});

// ======================================
// POST-QUERY MIDDLEWARE
// ======================================
tourSchema.post(/^find/, function (docs, next) {
  // DEBUG:
  console.log(`Query took ${Date.now() - this.start} ms`); // ms = milliseconds!

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
  // this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // NOTE: THE NEW CONDITION IS THAT geoNear must be the very first stage in the aggregation pipeline.
  // SOLUTION FOR NOW: A little better than manually switching the comment!
  // If first stage is not geoNear, prepend $match for secretTour

  // Only prepend secretTour filter if $geoNear is NOT the first stage
  if (!(this.pipeline()[0] && this.pipeline()[0].$geoNear)) {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  }

  // DEBUG:
  console.log(this.pipeline());

  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
