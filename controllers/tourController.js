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
  // after adding child ref into tourModel doc, there is only ref (id) of the guides!
  //   const tour = await Tour.findById(req.params.id);
  // implement .populate, when querying tours, it will fetch the full user info(doc) into by calling .populate()
  const tour = await Tour.findById(req.params.id).populate({
    path: 'guides',
    select: '-__v -passwordChangedAt', // exclude fields
  });
  // However,  calling .populate() will create new query!
  // Note: In the HUGE APP, manually calling .populate in every controller is repetitive and will fuck things up, eventually!
  // SOLUTION: go to -> Query Middleware

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
// #: GET /api/v1/tours/tour-stats - Aggregated Tour Statistics
// ======================================
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

// ======================================
// #: Monthly Plan - Unwinding Projecting - Tour start stats by month
// ======================================
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
