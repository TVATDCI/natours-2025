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
  console.log(req.params); // Logs the dynamic ID received from the URL

  // Convert the string ID from the URL into a number using *1
  const id = req.params.id * 1;

  // Use Array.prototype.find() to locate the tour with the matching ID
  const tour = tours.find((el) => el.id === id);

  // If no matching tour is found, respond with a 404 error
  // NOTE: You could also check `if (id > tours.length)`,
  //       but that approach assumes tour IDs are perfectly sequential,
  //       which may not be true and could lead to incorrect behavior.
  //   if (!tour) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid ID',
  //     });
  //   }

  // If found, respond with status(200)
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour, // They use just `tour` in modern JS
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
        data: {
          tour: newTour,
        },
      });
    }
  );
};

// #: updateTour
exports.updateTour = (req, res) => {
  // Convert id from string to number
  const id = req.params.id * 1;

  // Find the tour by ID
  const tour = tours.find((el) => el.id === id);

  // Return 404 if not found
  //   if (!tour) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid ID',
  //     });
  //   }

  // Simulate an update: override existing tour with data from req.body
  Object.assign(tour, req.body);

  // Send back the updated tour
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

// #: deleteTour
exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;

  const tourIndex = tours.findIndex((el) => el.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  tours.splice(tourIndex, 1);

  // 204 means No Content – don't return a body at all
  // NOTE: Use 204 when not returning any data — it's cleaner and more RESTful for DELETE actions.
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
