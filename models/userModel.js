const crypto = require('crypto'); // built-in node_model
const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');

// =======================
// User Schema Definition
// =======================
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name!'],
    },

    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true, // Transforms to lowercase before saving
      validate: [validator.isEmail, 'Please provide a valid email'],
    },

    photo: {
      type: String,
      default: 'default.jpg', // Add fallback to profile photo
    },
    photoId: {
      type: String, // store Cloudinary's public_id
    },

    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'], // enum validator used to specify certain type of of role
      default: 'user',
    },

    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8, // password should have a 8 char
      select: false, // Never send back password in queries.
    },

    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // NOTE: This only works on CREATE and SAVE!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords do not match!',
      },
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    // ...existing fields...
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  },
);

// ====================
// #: Virtual populates
// ================================================
// Use virtual populate to Connect user → Bookings
// ================================================

userSchema.virtual('bookings', {
  ref: 'Booking', // The model to use (bookingModel.js)
  foreignField: 'user', // Field in Booking model
  localField: '_id', // ObjectId in User model
});

// ======================
// #: Document Middleware
// ======================
// 1) Hashing new password before saving
userSchema.pre('save', async function (next) {
  // Only run if password is actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Remove passwordConfirm field -
  this.passwordConfirm = undefined;
  next();
});

// =====================================
// 2) Update passwordChangedAt timestamp
// =====================================
// This runs only before saving a user document
userSchema.pre('save', function (next) {
  // If password field has NOT been modified, OR this is a new document, skip
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// ============================================
// Query middleware: filter out inactive users
// ============================================
// To this point the inactive user (active: false)
userSchema.pre(/^find/, function (next) {
  // "this" points to current query
  this.find({ active: { $ne: false } });
  next();
});

// ===============================
// Instance Methods
// ===========================================
// Compare entered password to hashed password
// ===========================================
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword); // now both are being compared!
};

// =====================================================
// Check if user changed password after token was issued
// =====================================================
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // Convert passwordChangedAt to seconds and compare
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means password has NOT been changed after the token was issued
  return false;
};

// =========================================================================================
// Create NEW Password - Reset and create plain token - Hash the token and send back to user
// =========================================================================================
userSchema.methods.createPasswordResetToken = function () {
  // 1) Create PLAIN token (send to user via email)
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 2) Hash the token for DB storage (never store plain token)
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // check the object resetToken before sending back to the process!
  // console.log({ resetToken }, this.passwordResetToken);

  // 3) Set expiry (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // 4) Return plain token so controller can email it
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// Next stop - authController.js
