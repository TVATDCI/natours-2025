const User = require('../models/userModel');

// import catchAsync to wrap async functions so errors go straight to global error handler!
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// ===============================
// SIGN UP - Don't forget to check userRoutes!?
// ===============================

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  console.log(`newUser registered successfully!🦊: ${newUser.name}`);
  console.log(`email:📧: ${newUser.email}`);
  console.log(`password:🛂: ${newUser.password}`);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
