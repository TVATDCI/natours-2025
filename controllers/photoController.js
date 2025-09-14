/* eslint-disable */
// handles upload - save, remove, delete, default and save.
const fs = require('fs').promises;

exports.handleUserPhoto = async (req, filteredBody, user) => {
  // =========== Photo upload, remove and delete process ================
  //  If file was uploaded, add photo name to filteredBody
  // if (req.file) filteredBody.photo = req.file.filename; // It will store only the file name(.filename) in
  // uploaded-resized in memory(req.file.buffer) and sent here to store in public/img/users/...
  // Including remove and reset profile picture to fallback(default.jpg)
  // delete the photo directly after being removed!
  if (req.file) {
    // Case 1: User uploaded a new photo
    filteredBody.photo = req.file.filename;

    // cleanup: remove old photo if it wasn't default
    if (req.user.photo && req.user.photo !== 'default.jpg') {
      try {
        await fs.unlink(`public/img/users/${req.user.photo}`);
        console.log(`🗑 Deleted old photo: ${req.user.photo}`);
      } catch (err) {
        console.error('🟥 Failed to delete old photo:', err.message);
      }
    }
  } else if (req.body.photo === 'default.jpg') {
    // Case 2: User clicked "Remove photo" → reset to default
    if (req.user.photo && req.user.photo !== 'default.jpg') {
      try {
        await fs.unlink(`public/img/users/${req.user.photo}`);
        console.log(`🗑 Deleted removed photo: ${req.user.photo}`);
      } catch (err) {
        console.error('🟥 Failed to delete removed photo:', err.message);
      }
    }
    filteredBody.photo = 'default.jpg';
  }
};
