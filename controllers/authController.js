const crypto = require('crypto'); // reset password
const { promisify } = require('util'); // destructure the object and use directly
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');

// ===============================
// Helper: Create JWT Token
// ===============================
// #: Create JWT token
// ===================
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN, // reset to '1h'
  });

// ===================================================
// #: Create and send JWT token in cookie and response
// ===================================================
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
    httpOnly: true, // Prevents JS from reading the cookie in the browser → XSS PROTECTION
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
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // it secure will be false in development!

  // 3) Send JWT to the browser as an HTTP cookie
  // This allows automatic sending of token with every request (good for web apps, not mobile APIs)
  res.cookie('jwt', token, cookieOptions);

  // 4) Remove the password from the output field before sending back to the client
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
// #: SIGN UP - CREATE NEW DOCUMENT!
// ===============================
exports.signup = catchAsync(async (req, res, next) => {
  // const newUser = await User.create(req.body) // removed for a new implement below for a security reason!
  // the newUser is coming here with the whole .body. The admin role can be manipulated at this point!
  // == Original signup newUser without welcome email! ==========================================
  //   const newUser = await User.create({
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: req.body.password,
  //     select: false (userSchema) doesn’t apply on newly created docs, only on queries.
  //     To avoid password output in postman(any where else) set "user.password = undefined;" in createSendToken to avoid
  //    passwordConfirm: req.body.passwordConfirm,
  // passwordChangedAt: req.body.passwordChangedAt,
  // role: req.body.role, // Optional for learning dev: It SHOULD NOT be in production!

  // == NEWl signup newUser WITH welcome email! ==========================================
  const newUser = await User.create(req.body);

  const url = `${req.protocol}://${req.get('host')}/me`;
  console.log(`URL:📧: ${url}`);
  await new Email(newUser, url).sendWelcome();

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
  // Incorrect: "const user = await User.findOne({ email: req.body.email, password: req.body.password });"
  // If anyone passed "NoSQL injection" { "email": { "$gt": "" }, "password": "existingPassword" }
  // MongoDB would treat it as a condition (email > "") and return any user, bypassing login.

  // SOLUTION:   const user = await User.findOne({ email }).select('+password');
  // email is just a string from req.body.email.Mongoose doesn’t allow query operators like $gt inside plain string fields,
  // so { "$gt": "" } just gets treated as "object" (not a valid email).
  // ==================================================================
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
    return next(new AppError('INCORRECT EMAIL OR PASSWORD', 401)); // (401) Unauthorized
  }

  // STEP: 3) If everything is ok, send token with status(200)
  createSendToken(user, 200, res);
});

// ====================================
// #: LOGOUT Sending JWT with a mock 'loggedout' cookie
// ====================================
exports.logout = (req, res) => {
  res.cookie('jwt', 'theuserhasloggedoutthisisamockcookies', {
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 secs
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// ===========================================
// #: PROTECT - protect (all tours) middleware
// ===========================================
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
  req.user = currentUser; // For route handlers - It will be checked in restrictedTo !
  res.locals.user = currentUser; // For views/templates
  next();
});

// ===============================
// #: isLoggedIn middleware - Only for rendered pages. NO ERRORS - No token in the header
// Removed catchAsync (add try - catch) from global error, to allow logout to continue
// ===============================
exports.isLoggedIn = async (req, res, next) => {
  // 1) Check token (from Authorization header or cookies)
  if (req.cookies.jwt) {
    try {
      // 1) Verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      // 3) Check if user changed password after token was issued
      // console.log('Decoded JWT:', decoded);
      // console.log('Current user:', currentUser._id);
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER - Render the currentUser as a locals.user!
      res.locals.user = currentUser; // NOTE: makes user available - access in Pug templates
      return next();
    } catch (err) {
      return next();
    }
  }
  // just continue without crashing.
  next();
};

// Logged in user & admin or lead-guide made it to this point
// authController.protect, // must logged in
// authController.restrictTo('admin', 'lead-guide'), // admin or lead-guide only

// ===============================
// #: RESTRICT access by role (...roles)
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

// ===============================
// #: FORGET PASSWORD
// ===============================

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user by email
  const user = await User.findOne({ email: req.body.email }); // findOne email
  // No user(email) found - send back 404
  if (!user)
    return next(new AppError('There is no user with that email address.', 404));

  // 2) Generate reset token and save hashed values to DB (in userModel/instance method)
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // The password is not being changed yet

  // 3) Build reset URL
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    // 4) Send the email
    // PROD-User Inbox
    //   const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email.`;

    // await sendEmail({
    //   email: user.email,
    //   subject: 'Your password reset token (valid for 10 min)',
    //   message,
    // });

    // DEV-ONLY: expose resetURL test in Postman
    res.status(200).json({
      status: 'success',
      message:
        'Token generated (DEV: see resetURL) or copy resetTokenPlain. Go to resetPassword route and replace the resetToken in it.',
      resetURL, // <— remove in production
      resetTokenPlain: resetToken, // <— remove in production
    });
  } catch (err) {
    // Reset the token fields if email sending fails
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

// NOTE:

// ===============================
// #: RESET PASSWORD
// ===============================
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Hash token from the URL
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token) // call parameter (resetPassword/:token) in userRoutes to update the resetPassword
    .digest('hex');

  // 2) Find user with matching token & non-expired
  const user = await User.findOne({
    passwordResetToken: hashedToken, // Find user who sent the req with the email to match resetToken
    passwordResetExpires: { $gt: Date.now() }, // check if the reset password has expired
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  // NOTE: If the matching user found in the database
  // 3) 📗 Set the new password and confirm it!
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  // 4) Clear reset token fields
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 5) Save — triggers mongoose pre-save hooks hashing + passwordChangedAt
  // NOTE: To run all the validator, most importantly save middleware function, use save NOT update,
  await user.save(); // in userModel

  // 6) Log the user in with a fresh JWT
  createSendToken(user, 200, res);
});

// ===============================
// #: UPDATE CURRENT USER PASSWORD
// ===============================
exports.updatePassword = catchAsync(async (req, res, next) => {
  // console.log('Incoming body:', req.body);

  // 1) Get current user from collection and ask for the password from protect middleware
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct from `userSchema.methods.correctPassword`
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password like in step 3 in resetPassword
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // Use save(),runs the pre-save password hashing. NOT findByIdAndUpdate!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
