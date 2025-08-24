const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const factory = require('./handlerFactory');

// ===============================
// #: GET ALL USERS
// ===============================
// GET /api/v1/users
exports.getAllUsers = factory.getAll(User);
// refactored with getAll from handlerFactory
// exports.getAllUsers = catchAsync(async (req, res) => {
//   const users = await User.find();

//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });

// ===============================
// Utility: filter unwanted fields (like role, password, etc.)
// ===============================
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ===============================
// #: getMe - getting document based on current user id by taking the user.id from params.id
// ===============================
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// ===============================
// #: UPDATE CURRENT USER DATA
// ===============================
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user tries to POST password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  // 2) Filter out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');

  // TODO: add 'photo' later if upload is implemented...

  // 3) Update user document
  // NOTE: Nw findByIdAndUpdate is used here (not save())
  // Because updating user name, email has nothing to do with password hashing logic.
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, // return updated document
    runValidators: true, // run schema validators
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// ===============================
// #: DELETE (DEACTIVATE) CURRENT USER
// ===============================
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  // 204 deleted
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// ===============================
// #: GET A SINGLE USER BY ID
// ===============================
// GET /api/v1/users/:id
// Refactored with getOne from handlerFactory
exports.getUser = factory.getOne(User);
// exports.getUser = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     return next(new AppError('No user found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       user,
//     },
//   });
// });

// ===============================
// #: CREATE A USER
// ===============================
// POST /api/v1/users
exports.createUser = catchAsync(async (req, res) => {
  // Normally, you should use signup logic in authController,
  // not directly create a user like this (for security reasons).
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

// ===============================
// #: UPDATE A USER
// ===============================
// PATCH /api/v1/users/:id
exports.updateUser = catchAsync(async (req, res, next) => {
  // Never allow password updates here — should be handled in a dedicated route
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  // { new: true } returns updated doc, runValidators ensures schema rules
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// ===============================
// #: DELETE A USER
// ===============================
// DELETE /api/v1/users/:id
// exports.deleteUser = catchAsync(async (req, res, next) => {
//   const user = await User.findByIdAndDelete(req.params.id);

//   if (!user) {
//     return next(new AppError('No user found with that ID', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null, // No content on delete
//   });
// });
// ===================================================
// # deleteUser from deleteOne handlerFactory function
// NOTE: Refactored Version from handlerFactory!

exports.deleteUser = factory.deleteOne(User);
// ===================================================
