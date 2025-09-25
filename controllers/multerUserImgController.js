const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('../utils/cloudinary');

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

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  // Wrap Cloudinary upload in a Promise
  await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'natours/users',
        public_id: `user-${req.user.id}-${Date.now()}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);

        // Save Cloudinary URL for DB update
        req.file.filename = result.secure_url;
        resolve();
      },
    );

    uploadStream.end(buffer);
  });

  next();
});

// Middleware: resize photo
// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/${req.file.filename}`);

//   next();
// });
