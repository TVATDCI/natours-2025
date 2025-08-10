// const crypto = require('crypto'); // reset password
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// ===============================
// Helper: Create JWT Token
// ===============================
// NOTE: 2019: Unexpected block statement surrounding arrow body - error!
// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };
// SOLUTION: 2025: move the returned value immediately after the `=>`arrow to avoid the ESLint complaint
// GITHUB node-jsonwebtoken (https://github.com/auth0/node-jsonwebtoken)
// npm i jsonwebtoken (https://www.npmjs.com/package/jsonwebtoken)
// CREATE a new token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// DEBUG:
// NOTE: Check jwt.io for DEBUGGER!
// console.log('JWT_SECRET:', process.env.JWT_SECRET);

// ===============================
// Helper: Send JWT + Response
// ===============================
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true, // cookie can't be accessed by JS
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

// ===============================
// SIGN UP
// ===============================
exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body) // removed for a new implement below for a security reason!
  // the newUser is coming here with the whole .body. The admin role can be manipulated at this point!
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // role: req.body.role, // Optional for learning dev: It SHOULD NOT be in production!
  });

  // DEBUG:
  console.log(`User registered successfully:🧟: ${newUser.name}`);
  console.log(`Email:📧: ${newUser.email}`);
  console.log(`Password:📗: ${newUser.password}`);

  // Newly created newUser is ready. send the token to the client!
  createSendToken(newUser, 201, res);
});

// ===============================
// LOGIN
// ===============================
exports.login = catchAsync(async (req, res, next) => {
  // const email = req.body.email; // eslint will give a warning to use obj-destructuring to extract .body!
  const { email, password } = req.body; // reverse obj-destructuring with the same property(email) and variable(email) name - ES6

  // DEBUG:
  console.log('Login attempt for user:📧:', email);
  console.log('Logging in user HIT:❓:');
  console.log('Request body:🪪:✅:', req.body);

  // STEP: 1) Check if email & password exist
  if (!email || !password) {
    // DEBUG:
    console.log('Please provide email and password:🚨:');
    return next(new AppError('Please provide email and password!', 400));
  }

  // STEP: 2) Check if user exists & password is correct
  // NOTE: The output "(User.findOne({ email })" SHOULD NOT contain the password!
  // BUT: IMPORTANT - The password is needed to be select ".select('+password');" and verified inside the function!
  const user = await User.findOne({ email }).select('+password');

  // DEBUG: The password
  console.log('return user password', user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    // DEBUG:
    console.log('Incorrect email or password:⛔:', req.body);
    return next(new AppError('Incorrect email or password', 401));
  }

  // STEP: 3) If everything is ok, send token with status(200)
  createSendToken(user, 200, res);
});
