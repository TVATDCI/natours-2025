const crypto = require('crypto'); // built-in node_model
const mongoose = require('mongoose');
const validator = require('validator');

// For hashing password
const bcrypt = require('bcryptjs');

// ===============================
// User Schema Definition
// ===============================
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
      default: 'default.jpg',
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
      select: false, // Never send back password in queries
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

// ===============================
// Document Middleware
// ==================================
// 1) Hashing new password before saving
// ==================================
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

  // Set the passwordChangedAt property to current time (minus 1 second)
  // NOTE: To ensure the JWT issued *after* signup is always valid (avoids rare token issue if save() finishes slightly later)
  // SOLUTION: set the time stamp to minus 1 second(1000ms)?
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// ===============================
// Instance Methods
// ===========================================
// Compare entered password to hashed password
// ===========================================
userSchema.methods.correctPassword = async function (
  candidatePassword, // plain text from user input into the body(.body)
  userPassword, // hashed from DB - line 79 - this.password = await bcrypt.hash(this.password, 12);
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

// =====================================================================================
// Create NEW Password - Reset and create plain token - Hash the token and send back to user
// =====================================================================================
userSchema.methods.createPasswordResetToken = function () {
  // 1) Create PLAIN token (send to user via email)
  const resetToken = crypto.randomBytes(32).toString('hex'); // randomBytes will create 32 char "Plain token" save in ('hex)

  // ENCRYPTING flow - use crypto to encrypt, then use ('sha256) to createHash, update the resetToken and store it back to ('hex)
  // 2) Hash the token for DB storage (never store plain token)
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // check the object resetToken before sending back to the process!
  console.log({ resetToken }, this.passwordResetToken);

  // 3) Set expiry (10 minutes)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // 4) Return plain token so controller can email it
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// Next stop - authController.js
