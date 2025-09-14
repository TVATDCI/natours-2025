// controllers/multerController.js
const multer = require('multer');
const sharp = require('sharp');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// =============================
// Multer Setup
// =============================
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// Middleware: single photo upload
exports.uploadUserPhoto = upload.single('photo');

// Middleware: resize photo
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // WAIT: It can take time, add await for asynchronous before calling next!
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});
