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
