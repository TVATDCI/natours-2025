const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      'Booking successful! Please check your email for confirmation. If you are testing the booking and it does not show up immediately, please refresh or try again in a few minutes (Stripe may delay the first event). Thanks';
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
    return next(new AppError('No tour found with that name', 404));
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

// =======================================
// #: GET ADMIN - AN ADMIN MANAGEMENT PAGE
// =======================================
exports.getAdminDashboard = (req, res) => {
  res.status(200).render('admin/dashboard', {
    title: 'Admin Dashboard',
    user: req.user,
    section: 'dashboard', // later used to switch content
  });
};

// ==============================================
// #: GET ADMIN TOURS - MANAGE TOURS
// ==============================================

exports.getAdminTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('admin/adminTours', {
    title: 'Manage Tours',
    user: req.user,
    section: 'tours',
    tours,
  });
});

// ==============================================
// #: GET ADMIN USERS - MANAGE USERS
// ==============================================

exports.getAdminUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).render('admin/adminUsers', {
    title: 'Manage Users',
    user: req.user,
    section: 'users',
    users,
  });
});

// ==============================================
// #: GET ADMIN USERS - MANAGE BOOKINGS
// ==============================================

exports.getAdminBookings = catchAsync(async (req, res, next) => {
  const users = await Booking.find();
  res.status(200).render('admin/adminBookings', {
    title: 'Manage Bookings',
    user: req.user,
    section: 'bookings',
    users,
  });
});

// ==============================================
// #: GET ADMIN USERS - MANAGE REVIEWS
// ==============================================

exports.getAdminReviews = catchAsync(async (req, res, next) => {
  const users = await Review.find();
  res.status(200).render('admin/adminReviews', {
    title: 'Manage Reviews',
    user: req.review,
    section: 'reviews',
    users,
  });
});
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
