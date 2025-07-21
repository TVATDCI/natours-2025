const dotenv = require('dotenv');

const mongoose = require('mongoose');

const connectDB = require('./config/db');
const app = require('./app');

dotenv.config({ path: './config.env' });

// Call the function to connect
connectDB();

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: String,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  rating: 4.7,
  price: 497,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR:', err);
  });

// console.log(app.get('env'));
// console.log(process.env);
// console.log('NODE_ENV:', process.env.NODE_ENV);
// console.log('PORT:', process.env.PORT);
// console.log('USERNAME:', process.env.DEV_USERNAME);
// console.log('PASSWORD:', process.env.PASSWORD);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
