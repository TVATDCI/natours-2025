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

// Post Route
app.post('/api/v1/tours', (reg, res) => {
  // console.log(reg.body);

  // Create newId for successfully posted data
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, reg.body);

  // uUse .push to create a newTour to the tours data (tours-simple.json)
  tours.push(newTour);

  // Write file directly inside the event loop and stringify it as soon as it written!
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
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
