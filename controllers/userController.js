const User = require('../models/userModel');

const catchAsync = require('../utils/catchAsync');

// ===============================
// #: GET ALL USERS
// ===============================
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  // DEBUG: will be removed in production
  console.log(
    'Returned users:',
    users.map((u) => u.name),
  );

  // Send response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

// ===============================
// #: GET A USER
// ===============================
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route getUser is in progress',
  });
};

// ===============================
// #: CREATE A USER
// ===============================
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route createUser is in progress',
  });
};

// ===============================
// #: UPDATE A USER
// ===============================
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route updateUser is in progress',
  });
};

// ===============================
// # DELETE A USER
// ===============================
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route deleteUser is in progress',
  });
};
