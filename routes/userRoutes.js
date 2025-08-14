const express = require('express');

// Import controller
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// declare and define the Routers before mounting!
// logic: create routers for all routes and turn them into mini Express apps then mount them into the ROUTER below!
const router = express.Router();

// ===============================
// # AUTH ROUTES
// ===============================
router.post('/signup', authController.signup);
router.post('/login', authController.login);

//
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// ===============================
// # USER ROUTES
// ===============================
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
