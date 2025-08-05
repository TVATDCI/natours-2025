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
// #: PATCH /api/v1/tours/:id - Update an existing tour
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
// #: DELETE /api/v1/tours/:id - Delete a tour
// ======================================
exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }
    // DEBUG: dev-testing with status(200)
    // res.status(200).json({
    //   status: 'success',
    //   message: 'Tour deleted successfully',
    // });

    // NOTE: HTTP status(204) = No content. In RESTFUL API no data is sent back to the client in DELETE operation!
    // LEARN: 204 = "Request was successful, but there's no content to send back"
    //
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// ======================================
// #: AGGREGATION Pipeline Stages:
// ======================================

exports.getTourStats = async (req, res) => {
  try {
    // DEBUG:
    console.log('Running Tour Stats Aggregation...');

    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }, // match stage
      },
      {
        $group: {
          // group
          _id: '$difficulty', // or use null here for total stats
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        // NOTE: sort by any field you calculate in $group, like avgRating, numTours, etc.
        // $sort: { _id: 1 }, // Sort by difficulty: easy → medium → difficult
        $sort: { avgPrice: 1 }, // Sort by average price in Ascending order or -1 for Descending order
      },
      // NOTE: $match can also be rematched
      // In this case $ne ()= none equal to) match the ones which does not have difficulty to easy. result = difficult → medium
      // `_id` is used here because it is previously grouped by difficulty: _id: "$difficulty"
      //   {
      //     $match: { _id: { $ne: 'easy' } },
      //   },
    ]);
    // DEBUG:
    console.log('Aggregation Result:', JSON.stringify(stats, null, 2));

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    // DEBUG:
    console.error('Aggregation Error:', err.message);
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// ======================================
// #: Monthly Plan - Unwinding Projecting - Tour start stats by month?
// ======================================
exports.getMonthlyPlan = async (req, res) => {
  // Convert year from string to number (e.g., from req.params.year = '2025' to 2025)
  const year = +req.params.year; // Number(req.params.year) or req.params.year * 1

  // ====================================
  // NOTE: Validate year input
  // - to solve abc or isNan confusion.
  // - As it won't crash and still returned - 200 OK with Monthly Plan: []
  // ====================================
  // NOTE: if isNaN(year) will give a warning as to void the global isNaN() because it can behave unexpectedly with non-numbers.
  // (https://github.com/airbnb/javascript#standard-library--isnaneslintno-restricted-globals) - updated 31-07-25
  // SOLUTION: if Number.isNaN(year)
  if (Number.isNaN(year)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid year. Please provide a numeric value.',
    });
  }

  try {
    const plan = await Tour.aggregate([
      {
        // STEP 1: Break apart startDates array — one doc per date
        $unwind: '$startDates',
      },
      {
        // STEP 2: Only include dates from the specified year
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`), // Jan 1st of the year
            $lte: new Date(`${year}-12-31`), // Dec 31st of the year
          },
        },
      },
      {
        // STEP 3: Group by month, count tours, and collect names
        $group: {
          _id: { $month: '$startDates' }, // Group by month number (1–12)
          numTourStarts: { $sum: 1 }, // Count how many tours start in that month
          tours: { $push: '$name' }, // Push tour names into an 'array'
        },
      },
      {
        // STEP 4: Add 'month' field to replace `_id` for readability
        $addFields: { month: '$_id' }, // _id refers to month number. addField is used to copy _id value into a new field (month)
        // Once month field is created with _id value, use $project(below) ot remove _id field
      },
      {
        // STEP 5: Remove the `_id` field from results (using 'month' instead)
        $project: {
          _id: 0,
        }, // Project can be used as include or EXCLUDE. _id: 0 sets MongoDB to exclude _id field from the output
      },
      {
        // STEP 6: Sort months by how many tours start in each
        $sort: { numTourStarts: -1 }, // Descending order
      },
      {
        // STEP 7: Return only the top 6 months
        $limit: 6,
      },
    ]);

    // DEBUG: Log the plan to the console
    console.log('Monthly Plan:', plan);

    // STEP 8: Send JSON response
    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    // DEBUG: ERROR HANDLING
    console.error('Error in getMonthlyPlan:', err);

    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// ======================================
// #: AGGREGATION MIDDLEWARE
// ======================================
