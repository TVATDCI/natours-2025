const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      'Booking successful! Please check your email for confirmation. If your booking does not show up immediately, please refresh or try again in a few minutes (Stripe may delay the first event after code changes).';
    // console.log('✅ res.locals.alert set:', res.locals.alert);
  }

  next();
};

// ===========================
// #: GET OVERVIEW - ALL TOURS
// ===========================
exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from the collection
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

// ====================
// #: GET TOUR - A TOUR
// ====================

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('No tour found with that name', 404)); // << isOperational-Error message: err.message
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

// ==============================
// #: GET LOGIN FORM - LOGIN PAGE
// ==============================

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login Form',
  });
};

// ================================
// #: GET SIGNUP FORM - SIGNUP PAGE
// ================================

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
  });
};

// ====================================
// #: GET ACCOUNT - A USER ACCOUNT PAGE
// ====================================

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'User account',
  });
};

// =================================================================================
// #: GET MY TOURS - USER CAN QUERY INSIDE THEIR ACCOUNT TO CHECK THEIR BOOKED TOURS
// Note: Replaces manual booking query approach with virtual populate implementation
// =================================================================================
exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Populate the user's bookings (and tours inside them)
  const userWithTours = await User.findById(req.user.id).populate({
    path: 'bookedTours', // virtual populate
    populate: {
      path: 'tour', // nested populate for the tour inside each booking (bookingSchema.pre)
      model: 'Tour',
    },
  });

  if (!userWithTours) {
    return next(new AppError('User not found', 404)); // << isOperational-Error message: err.message
  }

  // 2) Extract tours from populated bookings
  const tours = (userWithTours.bookedTours || []).map((b) => b.tour);

  // 3) Render template with those tours
  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

// ==================================================================
// #: UPDATE USER SETTINGS - IN USER ACCOUNT PAGE - SAVE SETTINGS BTN
// ==================================================================
exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'User account',
    user: updatedUser,
  });
});
