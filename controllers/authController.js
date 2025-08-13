// const crypto = require('crypto'); // reset password
const { promisify } = require('util'); // destructure the object and use directly
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// ===============================
// Helper: Create JWT Token
// ===============================
// GITHUB node-jsonwebtoken (https://github.com/auth0/node-jsonwebtoken)
// npm i jsonwebtoken (https://www.npmjs.com/package/jsonwebtoken)
// NOTE: 2019: Unexpected block statement surrounding arrow body - error!
// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
// };
// ES6 arrow function - use an implicit return to simplify arrow function by removing the curly braces and the return keyword!
// REASON: Curly braces + return are only needed if your function body has multiple statements.
// ===============================
// #: Create JWT token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // reset to '1h'
  });

// TEST: TEMP - force a very short expiration for testing
// replace process.env.JWT_EXPIRES_IN with testing time (5s)
// const signToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: '5s', // short-lived token for test and don’t forget to revert this to process.env.JWT_EXPIRES_IN after the test.
//   });

// DEBUG:
// NOTE: Check jwt.io for DEBUGGER!
// console.log('JWT_SECRET:', process.env.JWT_SECRET);

// ===============================
// #: Create and send JWT token in cookie and response
// ===============================
const createSendToken = (user, statusCode, res) => {
  // 1) Create token with 1 hour expiry, based on the user's MongoDB _id
  // The _id is the unique identifier stored inside the token payload
  const token = signToken(user._id);

  // 2) Configure cookie options for storing JWT securely
  const cookieOptions = {
    expires: new Date(
      // Convert days to milliseconds, e.g. 90 days * 24h * 60m * 60s * 1000ms
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true, // Prevents JS from reading the cookie in the browser → XSS protection
    // Only send cookie over HTTPS in production (for security)
    // ...(process.env.NODE_ENV === 'production' && { secure: true }),
    // concise way to conditionally add properties inline without creating the object first
    // then mutating it or writing a multi-line if block.
    // If process.env.NODE_ENV === 'production' is true, then the expression evaluates to { secure: true }.
    // If it’s false, it evaluates to false.The ... spread operator spreads the properties of an object into cookieOptions.
  };
  // However, This ensures cookie is secure and encrypted during transit
  // NOTE: Stand alone: if statement add properties without cluttering the object literal.
  // secure should only be added in production if the condition is met (typically when HTTPS is enabled).
  // Then if statement modifies the object after it's created by adding a new property.
  // Putting the if statement outside allows it to conditionally add properties without cluttering the object literal.
  // It makes it very clear what properties are always present vs which are conditionally added.
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // 3) Send JWT to the browser as an HTTP cookie
  // This allows automatic sending of token with every request (good for web apps, not mobile APIs)
  res.cookie('jwt', token, cookieOptions);

  // 4) Remove the password field before sending the user back to the client
  // NOTE: Never leak password hashes (even if hashed, it’s sensitive info)
  user.password = undefined;

  // 5) Send the final JSON response with token + user data
  res.status(statusCode).json({
    status: 'success',
    token, // Still include token in body for APIs (e.g., mobile apps that can't rely on cookies)
    data: { user },
  });
};

// ===============================
// #: SIGN UP
// ===============================
exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body) // removed for a new implement below for a security reason!
  // the newUser is coming here with the whole .body. The admin role can be manipulated at this point!
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // passwordChangedAt: req.body.passwordChangedAt,
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
// #: LOGIN
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
  // However, password is explicitly selected (.select('+password');)here.
  // Because it's excluded by default in the schema, but is needed for bcrypt comparison for verification!
  const user = await User.findOne({ email }).select('+password');
  // IMPORTANT: The check for `!user` must happen BEFORE calling `user.correctPassword()`
  // Otherwise, if `user` is `null` (email not found), trying to call `correctPassword()`
  // That would cause a runtime error: "Cannot read properties of null".

  // const correct = await user.correctPassword(password, user.password);

  // SOLUTION:
  // By combining the two checks in one `if` statement:
  // If the user is not found (`!user`) → skip password comparison and return error.
  // If the user exists but password is wrong (`!await user.correctPassword(...)`) → return error.
  // This prevents crashes and keeps the login logic concise.
  // DEBUG: to check if the password has been explicitly selected?
  // console.log('return user body', user);

  if (!user || !(await user.correctPassword(password, user.password))) {
    console.log('Incorrect email or password:⛔:', req.body);
    return next(new AppError('Incorrect email or password', 401)); // (401) Unauthorized
  }

  // STEP: 3) If everything is ok, send token with status(200)
  createSendToken(user, 200, res);
});

// ===============================
// #: PROTECT - protect (all tours) middleware
// ===============================
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get token (from Authorization header or cookies)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // DEBUG:
  // console.log('Token:', token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // 2) Verify token (promisify to make it return a promise to the function)
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // signature(JWT_SECRET) needed to verify the token

  // DEBUG:
  // console.log('decoded', decoded);

  // 3) Check if user still exists and the id is inside the payload!
  const currentUser = await User.findById(decoded.id);
  // DEBUG:
  // console.log('Current User:🪪:', currentUser);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401),
    );
  }

  // 4) Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // 5) Grant access to PROTECTED ROUTE (tourRoutes)
  req.user = currentUser; // For route handlers
  res.locals.user = currentUser; // For views/templates
  next();
});

// Logged in user & admin or lead-guide made it to this point
// authController.protect, // must logged in
// authController.restrictTo('admin', 'lead-guide'), // admin or lead-guide only

// ===============================
// #: Restrict access by role (...roles)
// ===============================
// NOTE: Argument is NOT allowed directly in middleware function
// In this case, 'restrictTo' must accept arguments (like 'admin' or 'guide')
// before the middleware actually runs.
// SOLUTION: Use spread operator in a wrapper function that returns the real middleware.
// ES6: Uses an implicit return (no curly braces or 'return' keyword) when the function body is a single expression.
// REASON: Curly braces + return are only needed if your function body has multiple statements.
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // the middleware is here - req.user = currentUser made it here.
    // restrictedTo roles ['admin', lead-guide]. if role='user' is NOT in th roles arr? Then it's user last stop!
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403), // 403 = Forbidden
      );
    }
    next();
  };
