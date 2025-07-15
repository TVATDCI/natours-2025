const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// #: 1) MIDDLEWARES

app.use(morgan('dev'));

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware line: 10');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// #: 2) ROUTE HANDLERS

// #: getAllTours route
const getAllTours = (req, res) => {
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
const getTour = (req, res) => {
  console.log(req.params); // Logs the dynamic ID received from the URL

  // Convert the string ID from the URL into a number using *1
  const id = req.params.id * 1;

  // Use Array.prototype.find() to locate the tour with the matching ID
  const tour = tours.find((el) => el.id === id);

  // If no matching tour is found, respond with a 404 error
  // NOTE: You could also check `if (id > tours.length)`,
  //       but that approach assumes tour IDs are perfectly sequential,
  //       which may not be true and could lead to incorrect behavior.
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  // If found, respond with status(200)
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour, // They use just `tour` in modern JS
    },
  });
};

// #: createTour
const createTour = (req, res) => {
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
const updateTour = (req, res) => {
  // Convert id from string to number
  const id = req.params.id * 1;

  // Find the tour by ID
  const tour = tours.find((el) => el.id === id);

  // Return 404 if not found
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

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
const deleteTour = (req, res) => {
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

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour); // GET route to find a specific element by its ID in URLapp.post('/api/v1/tours', createTour); // Post Route to crate tour
// app.patch('/api/v1/tours/:id', updateTour); // PATCH route to update a specific tour (for practice only)
// app.delete('/api/v1/tours/:id', deleteTour); // DELETE route to remove a specific tour (for practice only)

// Use Express's dynamic route chaining to define multiple handlers on the same path

// #: 3) ROUTES
app
  .route('/api/v1/tours')
  .get(getAllTours) // Get all tours
  .post(createTour); // Create a new tour

app
  .route('/api/v1/tours/:id')
  .get(getTour) // Get a single tour by ID
  .patch(updateTour) // Update a specific tour
  .delete(deleteTour); // Delete a specific tour

// #: 4) START SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
