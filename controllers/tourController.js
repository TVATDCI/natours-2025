const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// #: CheckID Middleware
// This middleware intercepts routes with :id and handles the 404 check before the final handler runs.
// NOTE: It is also important to register param middleware (checkID) in tourRouter!
exports.checkID = (req, res, next, val) => {
  const id = val * 1;
  const tour = tours.find((el) => el.id === id);

  console.log(`Param Middleware tour:ID is: ${val}`); // CHECK CHECK!

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  next();
};

// #: getAllTours route
exports.getAllTours = (req, res) => {
  console.log(`Time requested at the top of getAllTours ${req.requestTime}`);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime, // <-- It will also appear inside respond body
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
exports.createTour = (req, res) => {
  // console.log(req.body); // Uncomment to inspect incoming data

  // using POST route to add a new tour
  // Create a new ID by incrementing the last tour's ID
  const newId = tours[tours.length - 1].id + 1;

  // Merge the new ID with the incoming request body to create a new tour object
  const newTour = Object.assign({ id: newId }, req.body);

  // Use .push to add the new tour to the in-memory tours array
  tours.push(newTour);

  // Persist the updated tours array to the JSON file
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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
    }
  );
};

// #: updateTour
exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  Object.assign(tour, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// #: deleteTour
exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;
  const index = tours.findIndex((el) => el.id === id);

  tours.splice(index, 1);

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// NOTE:OR Use 200 + message for debugging or want to inform the client about what was deleted.
//   res.status(200).json({
//     status: 'success',
//     message: `Tour with ID ${id} deleted successfully.`,
//   });
// });
