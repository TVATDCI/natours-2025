const multer = require('multer');
const sharp = require('sharp');
const cloudinary = require('../utils/cloudinary');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// Import flexible env for future maintainability
// const userFolder = process.env.CLOUDINARY_USER_FOLDER || 'natours/users';

// =============
// Multer Setup
// =============
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

// v.3 extended user schema store with both secure_url and public_id
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // Convert file buffer into optimized image buffer
  const buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  // Upload to Cloudinary (wrapped in Promise)
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        // folder: userFolder, // switch hard coded folder 'natours-2025/users' to flexible environment
        folder: 'natours-2025/users',
        public_id: `user-${req.user.id}-${Date.now()}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    uploadStream.end(buffer);
  });

  // Store both secure_url (for displaying)
  // public_id (for deletion)
  req.file.filename = uploadResult.secure_url;
  req.file.public_id = uploadResult.public_id;

  next();
});
