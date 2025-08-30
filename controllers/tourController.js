const Tour = require('../models/tourModel');
// const APIFeatures = require('../utils/apiFeatures');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const factory = require('./handlerFactory');

// ======================================
// #: Middleware:
// ======================================
// FEATURE: ROUTE ALIASING PATTERN
// NOTE: Use express concept to pre-field middleware to manipulate the query Object before calling getAllTours

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// ======================================
// #: GET /api/v1/tours - Get all tours
// ======================================
// Refactored with getAll from handlerFactory, included populate option.
// However, it is implemented with options afterQuery hook  for testing purposes, too!
// exports.getAllTours = factory.getAll(Tour, {
//   afterQuery: (tours) => {
//     console.log(
//       'Returned tours:',
//       tours.map((t) => t.name),
//     );
//   },
// });
exports.getAllTours = factory.getAll(Tour);
// =====================================================
// #: GET /api/v1/tours/:id - Get a specific tour by ID
// =====================================================
// Refactored with getOne from handlerFactory, included populate option.
exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// ======================================
// #: POST /api/v1/tours - REFACTORED Create a new tour
// ======================================
exports.createTour = factory.createOne(Tour);
// ============================================================================================
// NOTE: EXPERIMENT VERSION OF CREATE ONE, Used only in createTour + DEV logging. It will be replaced!
// exports.createTour = factory.createOneWithLogging(Tour);
// ============================================================================================
// ===============================================================
// #: PATCH /api/v1/tours/:id - REFACTORED Update an existing tour
// ===============================================================
exports.updateTour = factory.updateOne(Tour); // refactored by updateOne in handlerFactory
// ======================================
// #: DELETE /api/v1/tours/:id - REFACTORED Delete a tour
// ======================================
exports.deleteTour = factory.deleteOne(Tour);

// ============================================================
// #: GET /api/v1/tours/tour-stats - Aggregated Tour Statistics
// ============================================================
exports.getTourStats = catchAsync(async (req, res, next) => {
  // DEBUG: Log for development insight
  console.log('Running Tour Stats Aggregation...');

  // STEP 1: Run aggregation pipeline
  const stats = await Tour.aggregate([
    {
      // Filter tours with ratingsAverage >= 4.5
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      // Group tours by difficulty level and calculate statistics
      $group: {
        _id: '$difficulty', // Group by the 'difficulty' field or use null here for total stats
        numTours: { $sum: 1 }, // Count how many tours in each group
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      // Sort grouped results by average price (ascending) or -1 (descending)
      $sort: { avgPrice: 1 },
    },
    // OPTIONAL: Remove 'easy' difficulty tours
    // NOTE: $match can also be rematched
    // In this case $ne ()= none equal to) match the ones which does not have difficulty to easy. result = difficult → medium
    // `_id` is used here because it is previously grouped by difficulty: _id: "$difficulty"
    //   {
    //     $match: { _id: { $ne: 'easy' } },
    //   },
  ]);

  // DEBUG: Pretty-print stats in console
  console.log('Aggregation Result:', JSON.stringify(stats, null, 2));

  // STEP 2: Send JSON response
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// ==================================================================
// #: Monthly Plan - Unwinding Projecting - Tour start stats by month
// ==================================================================
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // STEP 0: // Convert year from string to number (e.g., from req.params.year = '2025' to 2025)
  const year = +req.params.year;
  // Number(req.params.year) or req.params.year * 1

  // STEP 1: Validate the year input
  // ====================================
  // NOTE: Validate year input
  // - to solve abc or isNan confusion.
  // - As it won't crash and still returned - 200 OK with Monthly Plan: []
  // ====================================
  // NOTE: if isNaN(year) will give a warning as to void the global isNaN() because it can behave unexpectedly with non-numbers.
  // (https://github.com/airbnb/javascript#standard-library--isnaneslintno-restricted-globals) - updated 31-07-25
  // SOLUTION: if Number.isNaN(year)
  if (Number.isNaN(year)) {
    return next(
      new AppError('Invalid year. Please provide a numeric value.', 400),
    );
  }

  // STEP 2: Build aggregation pipeline
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // Group by month number (1–12)
        numTourStarts: { $sum: 1 }, // Count how many tours start in that month
        tours: { $push: '$name' }, // Push tour names into an 'array'
      },
    },
    {
      $addFields: { month: '$_id' },
      // _id refers to month number. addField is used to copy _id value into a new field (month)
      // Once month field is created with _id value, use $project(below) ot remove _id field
    },
    {
      $project: { _id: 0 },
      // Project can be used as include or EXCLUDE. _id: 0 sets MongoDB to exclude _id field from the output
    },
    {
      $sort: { numTourStarts: -1 },
      // Descending order
    },
    {
      $limit: 6,
    },
  ]);

  // STEP 3: Send the response
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

// ==================================================================
// #: Controller function for “tours within radius” (geoWithin query)
// ==================================================================
// Example route:
//   GET /api/v1/tours/tours-within/100/center/34.111745,-118.113491/unit/mi
// Meaning:
//   - Find all tours within 100 miles
//   - From the point [lat=34.111745, lng=-118.113491]
//   - Distance unit is miles (or km if specified)
// ==================================================================

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;

  // Split "lat,lng" string into separate variables
  const [lat, lng] = latlng.split(',');

  // Validate that both values exist
  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400,
      ),
    );
  }

  console.log(distance, lat, lng, unit);

  // Convert distance to radians (distance / Earth's radius)
  // Earth radius: 3963.2 miles OR 6378.1 km
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  // Find all tours where the startLocation falls within the given circle
  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
    secretTour: { $ne: true }, // <- exclude secret tours. More info -> AGGREGATION MIDDLEWARE/tourModel
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

// ==================================================================
// #: Aggregation pipeline for calculating distances to all tours
// ==================================================================
// /tours/distances/:latlng/unit/:unit
// GET /api/v1/tours/distances/34.111745,-118.113491/unit/mi

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400,
      ),
    );
  }

  // Convert to meters (MongoDB default distance unit)
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001; // mi = miles, km = kilometers

  // Call tour model from aggregate pipeline for the calculation
  const distances = await Tour.aggregate([
    // $geoNear: Must be the first stage in an aggregation pipeline.
    // PS. if there are more than one field Geospatial index geoNear will need keys params to perform the task!
    // It requires a 2dsphere index on the startLocation field. (tourSchema.index({ startLocation: '2dsphere' });)
    // NOTE: near: Reference point (user’s coords) in GeoJSON { type: "Point", coordinates: [lng, lat] } format.
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        distanceField: 'distance', // distanceField: is the new field that MongoDB will calculate distances.
        distanceMultiplier: multiplier, // convert from meters
        query: { secretTour: { $ne: true } }, // filter inside geoNear! more info -> AGGREGATION MIDDLEWARE/tourModel
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
