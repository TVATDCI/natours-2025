// ======================================================
// Tour Image Upload & Processing Middleware
// ======================================================
const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// ---------------------
// Multer Configuration
// ---------------------
const multerStorage = multer.memoryStorage();

// Filter to accept only images
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Create multer upload middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// ---------------------
// Exported Middleware
// ---------------------
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

// ---------------------
// Resize Uploaded Images
// ---------------------
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // Skip if no files uploaded
  if (!req.files.imageCover || !req.files.images) return next();

  // ------------------
  // 1) Cover Image
  // ------------------
  const coverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333) // resize to 3:2 aspect ratio
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${coverFilename}`);

  // Add processed filename to req.body → will be saved in DB by updateOne
  req.body.imageCover = coverFilename;

  // ------------------
  // 2) Additional Images
  // ------------------
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    }),
  );
  // console.log('🖼 Tour images processed:', req.body);
  next();
});
