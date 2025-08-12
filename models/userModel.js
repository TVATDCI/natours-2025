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
      enum: ['user', 'guide', 'lead-guide', 'admin'],
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
// ===============================

// Hashing new password before saving
userSchema.pre('save', async function (next) {
  // Only run if password is actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Remove passwordConfirm field -
  this.passwordConfirm = undefined;
  next();
});

// ===============================
// Instance Methods
// ===============================

// Compare entered password to hashed password
userSchema.methods.correctPassword = async function (
  candidatePassword, // plain text from user input into the body(.body)
  userPassword, // hashed from DB - line 79 - this.password = await bcrypt.hash(this.password, 12);
) {
  return await bcrypt.compare(candidatePassword, userPassword); // now both are being compared!
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// Next stop - authController.js
