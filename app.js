const fs = require('fs');
const express = require('express');

const app = express();

// express middleware
app.use(express.json());

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Welcome to Natours API server side', app: 'Natours' });
// });
// app.post('/', (req, res) => {
//   res.send('Sending msg using post method endpoint...');
// });
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Route handler
app.get('/api/v1/tours', (reg, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length, // add .length to specify tours(arr with multiple objects)
    data: {
      tours: tours,
    },
  });
});

// GET route to find a specific element by its ID
app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params); // Logs the dynamic ID received from the URL

  // Convert the string ID from the URL into a number using *1
  const id = req.params.id * 1;

  // Use Array.prototype.find() to locate the tour with the matching ID
  const tour = tours.find((element) => element.id === id);

  // If no matching tour is found, respond with a 404 error
  // NOTE: You could also check `if (id > tours.length)`,
  //       but that approach assumes tour IDs are perfectly sequential,
  //       which may not be true and could lead to incorrect behavior.
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Meeb! Invalid ID',
    });
  }

  // If found, respond with status(200)
  res.status(200).json({
    status: 'success',
    data: {
      tour: tour, // They use just `tour` in modern JS
    },
  });
});

// Post Route
app.post('/api/v1/tours', (req, res) => {
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
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
