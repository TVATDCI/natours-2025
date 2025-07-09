const express = require('express');

const app = express();

// Root route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Natours API server...');
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
