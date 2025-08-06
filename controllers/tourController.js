const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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
exports.getAllTours = catchAsync(async (req, res, next) => {
  // STEP: 1) Build the query
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // STEP: 2) Execute the query
  const tours = await features.query;

  // DEBUG: will be removed in production
  console.log(
    'Returned tours:',
    tours.map((t) => t.name),
  );

  // STEP: 3) Send response
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

// ======================================
// #: GET /api/v1/tours/:id - Get a specific tour by ID
// ======================================
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

// ======================================
// SOLUTION: GET /api/v1/tours/:id - Ninja
// ======================================
// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id);
//   if (!tour) return next(new AppError('Tour not found', 404));

//   res.status(200).json({
//     status: 'success',
//     data: { tour },
//   });
// });

// ======================================
// #: POST /api/v1/tours - REFACTORED Create a new tour
// With catchAsync(async (req, res, next) => {const newTour = await Tour.create(req.body);
// ======================================

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  if (process.env.NODE_ENV === 'development') {
    console.log('Created tour:', {
      name: newTour.name,
      _id: newTour._id,
      price: newTour.price,
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

// ======================================
// #: PATCH /api/v1/tours/:id - REFACTORED Update an existing tour
// ======================================
exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTour) {
    return next(new AppError('Tour not found', 404));
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Updated tour:', {
      id: updatedTour._id,
      name: updatedTour.name,
      price: updatedTour.price,
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour,
    },
  });
});

// ======================================
// #: DELETE /api/v1/tours/:id - REFACTORED Delete a tour
// ======================================
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  // NOTE: 204 = No Content (successful, but nothing to send back)
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// ======================================
// #: AGGREGATION REFACTORED Pipeline Stages:
// ======================================
exports.getTourStats = catchAsync(async (req, res, next) => {
  // DEBUG:
  console.log('Running Tour Stats Aggregation...');

  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, // Filter tours with high ratings
    },
    {
      $group: {
        _id: '$difficulty', // Group by difficulty
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 }, // Sort by avgPrice ascending
    },
    // Optional match stage:
    // {
    //   $match: { _id: { $ne: 'easy' } },
    // },
  ]);

  // DEBUG:
  console.log('Aggregation Result:', JSON.stringify(stats, null, 2));

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// ======================================
// #: Monthly Plan - Unwinding Projecting - Tour start stats by month
// ======================================
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // STEP 0: Convert year param to number
  const year = +req.params.year;

  // STEP 1: Validate the year input
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
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
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
