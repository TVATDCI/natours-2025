const multer = require('multer');
const sharp = require('sharp');

const AppError = require('../utils/appError');

// ====================================
// #: IMAGE UPLOAD BY MULTER MIDDLEWARE
// In /updateMe - If file was uploaded, add photo name to filteredBody
// Implement if (req.file) filteredBody.photo = req.file.filename;
// NOTE: After the image is uploaded --> Implement the photo field inside userModel to save image to database
// ====================================
// 1) Storage configuration - NOTE: cb = call back
// NOTE: HOWEVER, For image processing, it's more practical to store the img in memoryStorage, not inside the disk!
// ====== storing img direct to the disk without processing ==========
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users'); // where to save!
//   },

//   filename: (req, file, cb) => {
// https://github.com/expressjs/multer
// console.log(req.file);
// { fieldname: 'photo',
//   originalname: 'leo.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   destination: 'public/img/users',
//   filename: '47dbd0b30b0b14259160dfaa0b4588ce',
//   path: 'public/img/users/47dbd0b30b0b14259160dfaa0b4588ce',
//   size: 207078 }
// user-userId-timestamp.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`); // specify time stamp to avoid upload at the same time!
//   },
// });

// =======================================================
// STORING IMG IN memoryStorage - for the image processing
// =======================================================
const multerStorage = multer.memoryStorage(); // The img will be stored as a buffer (sharp(req.file.buffer))

// multer filter

// 2) File filter (accept only images)
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    // specify file.mimetype upload only images
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
// Moved from userRoutes
// Then, follow above
// const upload = multer({ dest: 'public/img/users' });

// 3) Upload middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo'); // use it in userRoutes/updateMe
// It is also important to resize the uploaded photo
exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next(); // if there is no file req here then return next(); --> move on

  // if there is one, then save it to ...
  // re define the file.name after uploading for the resizing process
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // MORE: (https://github.com/lovell/sharp) OR (https://sharp.pixelplumbing.com/)
  // use sharp to call the img from memoryStorage to process
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg') // save it only in jpeg format
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`); // <<--Then save it again here

  next();
};
