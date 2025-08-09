const mongoose = require('mongoose');
const validator = require('validator');

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
        // This only works on CREATE and SAVE!
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

const User = mongoose.model('User', userSchema);

module.exports = User;
