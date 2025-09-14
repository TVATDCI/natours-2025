const fs = require('fs');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const { uploadUserPhoto, resizeUserPhoto } = require('./multerController'); // refactored version

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

// ====================================================
// #: UPDATE CURRENT USER DATA = name, email, photo
// ====================================================
// ==== Implement multer logic from multerController.js ===========
exports.uploadUserPhoto = uploadUserPhoto;
exports.resizeUserPhoto = resizeUserPhoto;

// ============ updateMe ================================
exports.updateMe = catchAsync(async (req, res, next) => {
  console.log(req.file);
  console.log('🟡 updateMe hit! Body:', req.body);

  // 1) Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    console.log('🔴 Password fields sent, rejecting...');
    return next(new AppError('This route is not for password updates.', 400));
  }

  // 2) Filter out unwanted fields not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  console.log('🟢 Filtered body:', filteredBody);

  // 3) If file was uploaded, add photo name to filteredBody
  // if (req.file) filteredBody.photo = req.file.filename; // It will store only the file name(.filename) in

  // uploaded-resized in memory(req.file.buffer) and sent here to store in public/img/users/...
  // Including remove and reset profile picture to fallback(default.jpg)
  // delete the photo directly after being removed!
  if (req.file) {
    // Case 1: User uploaded a new photo
    filteredBody.photo = req.file.filename;

    // cleanup: remove old photo if it wasn't default
    if (req.user.photo && req.user.photo !== 'default.jpg') {
      fs.unlink(`public/img/users/${req.user.photo}`, (err) => {
        if (err) console.error('🟥 Failed to delete old photo:', err);
      });
    }
  } else if (req.body.photo === 'default.jpg') {
    // Case 2: User clicked "Remove photo" → reset to default
    if (req.user.photo && req.user.photo !== 'default.jpg') {
      fs.unlink(`public/img/users/${req.user.photo}`, (err) => {
        if (err) console.error('🟥 Failed to delete old photo:', err);
      });
    }
    filteredBody.photo = 'default.jpg';
  }

  // 4) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  console.log('🟩 Updated user:', updatedUser);

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
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
