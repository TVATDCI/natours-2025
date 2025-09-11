const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

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

// ====================================
// #: GET ACCOUNT - A USER ACCOUNT PAGE
// ====================================

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'User account',
  });
};

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
