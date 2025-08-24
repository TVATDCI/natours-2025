// handlerFactory.js
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures'); // filtering, sorting, limiting, pagination

// ======================================
// DELETE ONE
// ======================================
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: doc,
    });
  });

// ======================================
// #: DELETE /api/v1/tours/:id - REFACTORED Delete a tour
// ======================================
//   exports.deleteTour = catchAsync(async (req, res, next) => {
//     const tour = await Tour.findByIdAndDelete(req.params.id);

//     if (!tour) {
//       return next(new AppError('Tour not found', 404));
//     }

// NOTE: 204 = No Content (successful, but nothing to send back)
//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   });

// ======================================
// UPDATE ONE
// ======================================
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// ======================================
// CREATE ONE (base generic handler)
// ======================================
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// ============================================================================================
// EXPERIMENT VERSION OF CREATE ONE, Used only in createTour + DEV logging. It will be deleted!
// ============================================================================================

exports.createOneWithLogging = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    if (process.env.NODE_ENV === 'development') {
      console.log('Created:', { id: doc._id, name: doc.name });
    }

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// ======================================
// GET ONE (optionally populate)
// ======================================
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id); // manipulate the the Model!
    if (popOptions) query = query.populate(popOptions);
    const doc = await query; // After it is done with populate then put it back into doc(this)

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

// ======================================
// GET ALL (supports nested routes)
// ======================================
exports.getAll = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    // Originally in getAllReview handler (reviewController)
    // To allow nested GET reviews on tour (simply hacked inline!)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // Option: It will also work (tested) But to keep the learning in the same level i switched back to original
    // If the request came from /tours/:tourId/reviews, then only return reviews for that tour
    // With ternary opt: This way is more concise than declaring let filter = {} and updating later!
    // const filter = req.params.tourId ? { tour: req.params.tourId } : {};

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    // Optional afterQuery hook  for testing purposes like logging. It will be removed.
    if (options.afterQuery) options.afterQuery(docs);

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
