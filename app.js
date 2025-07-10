const express = require('express');

const app = express();

// Root route
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Welcome to Natours API server side', app: 'Natours' });
});

// post route
app.post('/', (req, res) => {
  res.send('Sending msg using post method endpoint...');
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
