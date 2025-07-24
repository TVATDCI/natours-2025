const Tour = require('../models/tourModel');

// #: Middleware: Check that request body has required fields (used only for dev/testing)
// NOTE: deleted after setting up tourModel.js
// tourController.checkBody in tourRoutes.js must be removed as well!

// #: GET /api/v1/tours - Get all tours
exports.getAllTours = async (req, res) => {
  try {
    // Use destructuring (spread opt) to create a shallow copy of req.query so we can modify it safely
    const queryObj = { ...req.query };

    // Define fields to exclude from filtering (used later for pagination, sorting and more)
    const excludeFields = ['page', 'sort', 'limit', 'fields'];

    // Remove those excluded fields from queryObj
    excludeFields.forEach((field) => delete queryObj[field]);

    // DEBUG: Log incoming query and the filtered query object
    console.log('Raw query:', req.query);
    console.log('Filtering with queryObj:', queryObj);

    // Perform the database query using only valid filter fields
    const tours = await Tour.find(queryObj);

    // NOTE: or as usual.
    // const tours = await Tour.find(req.query);

    // TEST: Hard coded MongoDB query
    // const tours = await Tour.find({
    //   duration: 7,
    //   difficulty: 'medium',
    // });

    // TEST: Special mongoose query chaining!?!
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy');

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// #: GET /api/v1/tours/:id - Get a specific tour by ID
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

// #: POST /api/v1/tours - Create a new tour
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

// #: PATCH /api/v1/tours/:id - Update an existing tour
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

// #: DELETE /api/v1/tours/:id - Delete a tour
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
    // #: 204 = "Request was successful, but there's no content to send back"
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
