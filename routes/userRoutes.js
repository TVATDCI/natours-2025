const express = require('express');
// import multer for img upload
// const multer = require('multer'); moved to userController.js

// Import controller
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// upload images
// const upload = multer({ dest: 'public/img/users' }); // to the file system, NOT in the database - moved to userController

// declare and define the Routers before mounting!
// logic: create routers for all routes and turn them into mini Express apps then mount them into the ROUTER below!
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
// Authentication Middleware (authController.protect):
// This middleware checks if the request contains a valid JWT token.
// If the token is missing or invalid,  preventing unauthorized access to the routes.
// Now "authController.protect" can be removed from this point.

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

/**
 * Avoiding repeating tourController by destructuring Object method! DRY 
 * I would!
 * const express = require('express');
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/tourController');

const router = express.Router();

router
  .route('/')
  .get(getAllUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
  
 */
