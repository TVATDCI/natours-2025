const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// =============================================================
// #: GLOBAL ALERT HANDLER (Stripe & Other Notifications)
// =============================================================
exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      'Booking successful! Please check your email for confirmation. If you are testing the booking and it does not show up immediately, please refresh or try again in a few minutes (Stripe may delay the first event). Thanks!';
  }
  next();
};

// =============================================================
// #: PUBLIC VIEWS (Overview, Single Tour, Auth Pages)
// =============================================================

// ----- Get Overview (All Tours)
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

// ----- Get Tour (Single Tour Page)
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) return next(new AppError('No tour found with that name', 404));

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

// ----- Get Login Form
exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Login Form',
  });
};

// ----- Get Signup Form
exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create your account',
  });
};

// =============================================================
// #: USER ACCOUNT & PERSONAL SETTINGS
// =============================================================

// ----- Get Account Page
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'User Account',
  });
};

// ----- Update User Data (Settings)
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
    title: 'User Account',
    user: updatedUser,
  });
});

// ----- Get My Tours (Booked Tours)
exports.getMyTours = catchAsync(async (req, res, next) => {
  const userWithTours = await User.findById(req.user.id).populate({
    path: 'bookedTours',
    populate: { path: 'tour', model: 'Tour' },
  });

  if (!userWithTours) return next(new AppError('User not found', 404));

  const tours = (userWithTours.bookedTours || []).map((b) => b.tour);

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

// =============================================================
// #: ADMIN DASHBOARD & MANAGEMENT SECTIONS
// =============================================================

// ----- Get Admin Dashboard
exports.getAdminDashboard = (req, res) => {
  res.status(200).render('admin/dashboard', {
    title: 'Admin Dashboard',
    user: req.user,
    section: 'dashboard',
  });
};

// ----- Manage Tours
exports.getAdminTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('admin/adminTours', {
    title: 'Manage Tours',
    user: req.user,
    section: 'tours',
    tours,
  });
});

// ----- Manage / Edit Tour Details
exports.getAdminTourDetail = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).render('admin/edit/tourDetail', {
    title: `Manage ${tour.name}`,
    user: req.user,
    tour,
  });
});

exports.deleteAdminTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.redirect('/admin/tours');
});

// ----- Manage Users
exports.getAdminUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).render('admin/adminUsers', {
    title: 'Manage Users',
    user: req.user,
    section: 'users',
    users,
  });
});

// ----- Manage / Edit User Details
exports.getAdminUserDetail = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('+active');

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).render('admin/edit/userDetail', {
    title: `Manage ${user.name}`,
    user: req.user,
    selectedUser: user,
  });
});

exports.deleteAdminUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect('/admin/users');
});

// ----- Manage Bookings
exports.getAdminBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find();
  res.status(200).render('admin/adminBookings', {
    title: 'Manage Bookings',
    user: req.user,
    section: 'bookings',
    bookings,
  });
});

// ----- Manage Reviews
exports.getAdminReviews = catchAsync(async (req, res, next) => {
  const page = req.query.page * 1 || 1; // default to page 1
  const limit = 10; // reviews per page
  const skip = (page - 1) * limit;

  const totalReviews = await Review.countDocuments();
  const totalPages = Math.ceil(totalReviews / limit);

  const reviews = await Review.find()
    .populate('user', 'name photo')
    .populate('tour', 'name')
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  res.status(200).render('admin/adminReviews', {
    title: 'Manage Reviews',
    user: req.user,
    section: 'reviews',
    reviews,
    currentPage: page,
    totalPages,
  });
});
