const User = require('../models/userModel');

// import catchAsync to wrap async functions so errors go straight to global error handler!
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// ===============================
// SIGN UP - Don't forget to check userRoutes!?
// ===============================

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
