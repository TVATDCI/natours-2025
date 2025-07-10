const fs = require('fs');
const express = require('express');

const app = express();

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

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
