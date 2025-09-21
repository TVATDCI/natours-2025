const Tour = require('../models/tourModel');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const {
  uploadTourImages,
  resizeTourImages,
} = require('./multerTourImgController');

// ====================================================
// ==== Implement multer logic from multerTourImgController.js ===========
exports.uploadTourImages = uploadTourImages;
exports.resizeTourImages = resizeTourImages;
// ====================================================

// =========================================
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

// ====================================================
// =============== ACTUAL TOUR HANDLERS ===============
// ====================================================

// ======================================
// #: GET /api/v1/tours - Get all tours
// ======================================
exports.getAllTours = factory.getAll(Tour);

// =====================================================
// #: GET /api/v1/tours/:id - Get a specific tour by ID
// =====================================================
exports.getTour = factory.getOne(Tour, { path: 'reviews' });

// ====================================================
// #: POST /api/v1/tours - REFACTORED Create a new tour
// =====================================================
exports.createTour = factory.createOne(Tour);

// ===============================================================
// #: PATCH /api/v1/tours/:id - REFACTORED Update an existing tour
// ===============================================================
exports.updateTour = factory.updateOne(Tour);

// ======================================================
// #: DELETE /api/v1/tours/:id - REFACTORED Delete a tour
// ======================================================
exports.deleteTour = factory.deleteOne(Tour);

// ============================================================
// #: GET /api/v1/tours/tour-stats - Aggregated Tour Statistics
// ============================================================
exports.getTourStats = catchAsync(async (req, res, next) => {
  // console.log('Running Tour Stats Aggregation...');

  // STEP 1: Run aggregation pipeline
  const stats = await Tour.aggregate([
    {
      // Filter tours with ratingsAverage >= 4.5
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
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
      $sort: { avgPrice: 1 },
    },
  ]);

  // console.log('Aggregation Result:', JSON.stringify(stats, null, 2));

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
    },
    {
      $project: { _id: 0 },
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

  // .log(distance, lat, lng, unit);

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  // Find all tours where the startLocation falls within the given circle
  const tours = await Tour.find({
    startLocation: {
      $geoWithin: { $centerSphere: [[lng, lat], radius] },
    },
    secretTour: { $ne: true },
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
  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  // Call tour model from aggregate pipeline for the calculation
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
        query: { secretTour: { $ne: true } },
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
