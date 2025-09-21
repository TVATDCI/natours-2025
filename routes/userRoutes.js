const express = require('express');

// Import controller
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// ===============================
// # AUTH - controller ROUTES
// ===============================
router.post('/signup', authController.signup);
router.post('/login', authController.login); // sending data
router.get('/logout', authController.logout); // getting data

//
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

// route for password updates must be protected. So only current logged-in users can use it:
router.patch(
  '/updateMyPassword',
  // authController.protect,
  authController.updatePassword,
);

// route getMe to get doc from current user = ME
router.get(
  '/me',
  // authController.protect,
  userController.getMe,
  userController.getUser,
);
// route for update user DATA
// implement upload (single)img to /updateMe. ('photo') = ('name of the field')
router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
// deleteMe - DEACTIVATE
router.delete('/deleteMe', userController.deleteMe);

// ========================================
// # USER - controller - ROUTES Admins ONLY
// ========================================
// Protect all routes after this middleware for Admins Only!
// =========================================================
router.use(authController.restrictTo('admin'));
// =========================================================
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
