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

// Store uploaded files in memory as Buffer objects
// (Sharp can then process them before writing to disk)
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

// Middleware to handle multiple image uploads on tours
// - `imageCover`: 1 file
// - `images`: up to 3 files
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

  console.log('🖼 Tour images processed:', req.body);

  next();
});

// V.1
// ========== Upload multi photos ==========
// const multerStorage = multer.memoryStorage(); // in memory(req.file.buffer)

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Not an image! Please upload only images.', 400), false);
//   }
// };

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

// // like uploading user photo but instead of upload.single, to upload.fields
// exports.uploadTourImages = upload.fields([
//   { name: 'imageCover', maxCount: 1 },
//   { name: 'images', maxCount: 3 },
// ]);

// // upload.single('image');
// // upload.array('images', 5);

// // Middleware: resize UPLOADED Tour Images
// exports.resizeTourImages = catchAsync(async (req, res, next) => {
//   // If there is no req for these files then --> move on!
//   if (!req.files.imageCover || !req.files.images) return next();

//   // The process - updateOne update the document

//   // 1) Cover image (imageCover) is an array[]
//   // const  imageCoverFilename = `tour-${req.param.id}-${Date.now()}.jpeg`;
//   req.body.imageCover = `tour-${req.params.id}-${Date.now()}.jpeg`;
//   await sharp(req.files.imageCover[0].buffer)
//     .resize(2000, 1333)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/tours/${req.body.imageCover}`); // << replaced  imageCoverFilename!
//   // update take the whole req.body
//   // req.body.imageCover = imageCoverFilename

//   // 2) Images can again take much longer = await all
//   req.body.images = [];
//   await Promise.all(
//     req.files.images.map(async (file, i) => {
//       const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

//       await sharp(file.buffer)
//         .resize(2000, 1333)
//         .toFormat('jpeg')
//         .jpeg({ quality: 90 })
//         .toFile(`public/img/tours/${filename}`);

//       req.body.images.push(filename);
//     }),
//   );

//   console.log(req.body);
//   next();
// });
