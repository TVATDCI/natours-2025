const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);

// #: CheckID Middleware
// This middleware intercepts routes with :id and handles the 404 check before the final handler runs.
// NOTE: It is also important to register param middleware (checkID) in tourRouter!
exports.checkID = (req, res, next, val) => {
  const id = val * 1;
  const tour = tours.find((el) => el.id === id);

  console.log(`Param Middleware tour:ID is: ${val}`); // DEBUG:

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

// #: checkBody Middleware
// This middleware checks if the request body contains required fields (name and price) before creating a new tour
exports.checkBody = (req, res, next) => {
  // create variable for object destructuring method
  // 1. not to repeat req.body.property(in the object arr)
  // 2. Easier to validate multiple properties!
  const { name, price } = req.body;

  console.log(`Validation passed: name = ${name}, price = ${price}`); // DEBUG:

  if (!name || !price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price in request body',
    });
  }

  next();
};

// #: getAllTours route
exports.getAllTours = (req, res) => {
  console.log(`Time requested at the top of getAllTours ${req.requestTime}`); // DEBUG:

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime, // DEBUG: It will also appear inside respond body
    results: tours.length, // add .length to specify tours(arr with multiple objects)
    data: {
      tours: tours,
    },
  });
};

// #: getTour
exports.getTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    data: {
      tour,
    },
  });
};

// #: createTour
// using POST route to add a new tour
exports.createTour = (req, res) => {
  // console.log(req.body); // Uncomment to inspect incoming data

  // Create a new ID by incrementing the last tour's ID method
  // Assuming the last tour in the array has the highest ID, which may not be true.
  // For example, if the last tour is ID 11 but ID 13 was deleted, this will reuse ID 12 incorrectly.
  // const newId = tours[tours.length - 1].id + 1;

  // Find the max ID manually
  // Dynamically find the highest current ID in case some tours were deleted
  // This ensures that IDs stay unique even if they are not sequential

  const maxId = tours.reduce((max, tour) => Math.max(max, tour.id), 0);
  const newId = maxId + 1;

  // Merge the new ID with the incoming request body to create a new tour object
  const newTour = { id: newId, ...req.body };

  // Use .push to add the new tour to the in-memory tours array
  tours.push(newTour);

  // Persist the updated tours array to the JSON file
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // Handle potential file write errors
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to write to file',
        });
      }

      // Respond with success and the newly added tour
      res.status(201).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
          tour: newTour,
        },
      });
    },
  );
};

// #: updateTour
exports.updateTour = (req, res) => {
  const id = req.params.id * 1;

  // Find index of the tour
  const tourIndex = tours.findIndex((el) => el.id === id);

  // const updatedTour = Object.assign({}, tours[tourIndex], req.body);
  // tours[tourIndex] = updatedTour;

  // NOTE: Switch merging method to "spread operator"
  // NOTE: object spread for shallow merging
  //Keeps old data safe if nothing is changed
  //Updates only what was sent in req.body
  //Avoids mutating the original object directly

  // Update the tour data at that index
  tours[tourIndex] = { ...tours[tourIndex], ...req.body };

  // Write updated data to the origin file
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to write updated tour to file',
        });
      }

      res.status(200).json({
        status: 'success',
        data: {
          tour: tours[tourIndex],
        },
      });
    },
  );
};

// #: deleteTour
exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;

  // Find index of tour to delete (checkID already guaranteed it exists)
  const index = tours.findIndex((el) => el.id === id);

  // Remove from the in-memory array
  tours.splice(index, 1);

  // Write updated data back to file
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Failed to write deletion to file',
        });
      }

      res.status(204).json({
        status: 'success',
        data: null,
      });
    },
  );
};

// NOTE:OR Use 200 + message for debugging or want to inform the client about what was deleted.
//   res.status(200).json({
//     status: 'success',
//     message: `Tour with ID ${id} deleted successfully.`,
//   });
// });
