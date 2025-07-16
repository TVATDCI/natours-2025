const express = require('express');

// #: getAllUsers
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route getAllUsers is in progress',
  });
};

// #: getUser
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route getUser is in progress',
  });
};

// #: createUser
const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route createUser is in progress',
  });
};

// #: updateUser
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route updateUser is in progress',
  });
};

// #: deleteUser
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route deleteUser is in progress',
  });
};
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour); // GET route to find a specific element by its ID in URLapp.post('/api/v1/tours', createTour); // Post Route to crate tour
// app.patch('/api/v1/tours/:id', updateTour); // PATCH route to update a specific tour (for practice only)
// app.delete('/api/v1/tours/:id', deleteTour); // DELETE route to remove a specific tour (for practice only)

// declare and define the Routers before mounting!
// logic: create routers for all routes and turn them into mini Express apps then mount them into the ROUTER below!
const router = express.Router();

// #: Users Routes
router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
