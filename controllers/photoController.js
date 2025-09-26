/* eslint-disable */
// == Photo upload, remove and delete process ==== on cloudinary ============
const cloudinary = require('../utils/cloudinary');

exports.handleUserPhoto = async (req, filteredBody, user) => {
  // =================================
  // Case 1: User uploaded a new photo
  // Already handled in multerUserImgController by setting req.file.filename + public_id)
  // =================================
  if (req.file) {
    filteredBody.photo = req.file.filename; // secure_url
    filteredBody.photoId = req.file.public_id;

    // Delete old photo from Cloudinary (if not default)
    if (user.photoId) {
      try {
        await cloudinary.uploader.destroy(user.photoId);
        if (process.env.NODE_ENV !== 'production') {
          console.log(`Deleted old Cloudinary photo: ${user.photoId}`);
        }
      } catch (err) {
        console.error('🟥 Failed to delete old Cloudinary photo:', err.message);
      }
    }

    // ===================================
    // Case 2: User clicked "Remove photo"
    // ===================================
  } else if (req.body.photo === 'default.jpg') {
    if (user.photoId) {
      try {
        await cloudinary.uploader.destroy(user.photoId);
        if (process.env.NODE_ENV !== 'production') {
          console.log(`🗑 Deleted removed Cloudinary photo: ${user.photoId}`);
        }
      } catch (err) {
        console.error('🟥 Failed to delete Cloudinary photo:', err.message);
      }
    }
    filteredBody.photo = 'default.jpg';
    filteredBody.photoId = undefined;
  }
};

// v.1 upload, store and delete locally
// const fs = require('fs').promises;

// exports.handleUserPhoto = async (req, filteredBody, user) => {
//   // =========================
//   // Case 1: User uploaded a new photo
//   // =========================
//   if (req.file) {
//     filteredBody.photo = req.file.filename;

//     // Cleanup old photo if not default
//     if (user.photo && user.photo !== 'default.jpg') {
//       try {
//         await fs.unlink(`public/img/users/${user.photo}`);
//         if (process.env.NODE_ENV !== 'production') {
//           console.log(`🗑 Deleted old photo: ${user.photo}`);
//         }
//       } catch (err) {
//         console.error('🟥 Failed to delete old photo:', err.message);
//       }
//     }

//     // =========================
//     // Case 2: User clicked "Remove photo" → reset to default
//     // =========================
//   } else if (req.body.photo === 'default.jpg') {
//     if (user.photo && user.photo !== 'default.jpg') {
//       try {
//         await fs.unlink(`public/img/users/${user.photo}`);
//         if (process.env.NODE_ENV !== 'production') {
//           console.log(`🗑 Deleted removed photo: ${user.photo}`);
//         }
//       } catch (err) {
//         console.error('🟥 Failed to delete removed photo:', err.message);
//       }
//     }
//     filteredBody.photo = 'default.jpg';
//   }
// };
