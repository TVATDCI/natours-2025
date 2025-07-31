const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');

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
exports.getAllTours = async (req, res) => {
  // DEBUG
  console.log('Raw query:', req.query);
  try {
    // STEP: 1) Build the query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // STEP: 2) Execute the query
    const tours = await features.query;

    // OPTIONAL: paginate() method in APIFeatures is a synchronous chainable method. Injecting an await would break the flow.
    // SOLUTION: optional err handler status (404), when paginate out of range, after executing the query in controller!
    // if (tours.length === 0 && req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   const page = req.query.page * 1 || 1;
    //   const limit = req.query.limit * 1 || 100;
    //   const skip = (page - 1) * limit;

    //   if (skip >= numTours) {
    //     return res.status(404).json({
    //       status: 'fail',
    //       message: 'This page does not exist',
    //     });
    //   }
    // }

    // DEBUG
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// ======================================
// #: GET /api/v1/tours/:id - Get a specific tour by ID
// ======================================
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id req.params.id})

    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    // NOTE: request succeeds and the server returns content (usually JSON).
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid ID format or error fetching tour',
    });
  }
};

// ======================================
// #: POST /api/v1/tours - Create a new tour
// ======================================
exports.createTour = async (req, res) => {
  try {
    // NOTE: core concept in JavaScript and Mongoose
    // const newTour = new Tour({})
    // newTour.save()
    /**
     * Two ways to create and save a Mongoose document:
     *
     * 1. Manual: Instantiate and then save
     *    const newTour = new Tour(req.body);
     *    await newTour.save();
     *
     * 2. Shortcut: .create() does both in one step
     *    const newTour = await Tour.create(req.body);
     *
     * Both return the saved document.
     * Are asynchronous and should be awaited.
     * Will trigger schema validation before writing to MongoDB.
     */

    // Shorthand using Model.create()
    const newTour = await Tour.create(req.body);

    // DEBUG: in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Created tour:', {
        name: newTour.name,
        _id: newTour._id,
        price: newTour.price,
      });
    }

    // NOTE: a new resource is successfully created on the server.
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });

    // NOTE: The server cannot process the request because it's malformed, invalid, or logically incorrect.
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

// ======================================
// #: PATCH /api/v1/tours/:id - Update an existing tour
// ======================================
exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return updated document
      runValidators: true, // validate update against schema
    });

    if (!updatedTour) {
      // NOTE: 404 Not Found. The request was properly formed, but the resource does not exist.
      return res.status(404).json({
        status: 'fail',
        message: 'Tour not found',
      });
    }

    // DEBUG: in developemnt
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

    // NOTE: The server cannot process the request because it's malformed, invalid, or logically incorrect.
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

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
// #: Monthly Plan - Tour start stats by month
// ======================================
exports.getMonthlyPlan = async (req, res) => {
  // Convert year from string to number (e.g., from req.params.year = '2025' to 2025)
  const year = +req.params.year; // Number(req.params.year) or req.params.year * 1

  // ====================================
  // NOTE: Validate year input
  // - to solve abc or isNan confusion.
  // - As won't crash and still returned - 200 OK with Monthly Plan: []
  // ====================================
  // NOTE: if isNaN(year) will give a warning as to void the global isNaN() because it can behave unexpectedly with non-numbers.
  // (https://github.com/airbnb/javascript#standard-library--isnaneslintno-restricted-globals)
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
          tours: { $push: '$name' }, // Push tour names into an array
        },
      },
      {
        // STEP 4: Add 'month' field to replace `_id` for readability
        $addFields: { month: '$_id' },
      },
      {
        // STEP 5: Remove the `_id` field from results (we now use 'month')
        $project: {
          _id: 0,
        },
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
