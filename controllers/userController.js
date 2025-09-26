const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const {
  uploadUserPhoto,
  resizeUserPhoto,
} = require('./multerUserImgController'); // refactored version
const { handleUserPhoto } = require('./photoController');

const factory = require('./handlerFactory');

// ================
// #: GET ALL USERS
// ================
exports.getAllUsers = factory.getAll(User);

// ===========================================================
// Utility: filter unwanted fields (like role, password, etc.)
// ==========================================================
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// =========================================================================================
// #: getMe - getting document based on current user id by taking the user.id from params.id
// =========================================================================================
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// ====================================================
// #: UPDATE CURRENT USER DATA = name, email, photo
// ====================================================
exports.uploadUserPhoto = uploadUserPhoto;
exports.resizeUserPhoto = resizeUserPhoto;

// ============ updateMe ================================
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  //console.log('🟡 updateMe hit! Body:', req.body);

  // 1) Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    // console.log('🔴 Password fields sent, rejecting...');
    return next(new AppError('This route is not for password updates.', 400));
  }

  // 2) Filter out unwanted fields not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // console.log('🟢 Filtered body:', filteredBody);

  // 3) Handle photo updates (upload, remove, cleanup)
  // Moved to photoController
  await handleUserPhoto(req, filteredBody, req.user);

  // 4) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // console.log('🟩 Updated user:', updatedUser);

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

// ===================================
// #: DELETE (DEACTIVATE) CURRENT USER
// ===================================
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// ==========================
// #: GET A SINGLE USER BY ID
// ==========================
exports.getUser = factory.getOne(User);

// =================
// #: CREATE A USER
// =================
// POST /api/v1/users
exports.createUser = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

// =================
// #: UPDATE A USER
// =================
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
exports.deleteUser = factory.deleteOne(User);
