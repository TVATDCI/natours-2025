// const mongoose = require('mongoose');

// const tourSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, 'A tour must have a name'],
//     unique: true,
//   },
//   rating: {
//     type: Number,
//     default: 4.5,
//   },
//   price: {
//     type: String,
//     required: [true, 'A tour must have a price'],
//   },
// });

// const Tour = mongoose.model('Tour', tourSchema);
// module.exports = Tour;

// Temporary seed script
// const Tour = require('./models/tourModel');

// const seed = async () => {
//   try {
//     const tour = await Tour.create({
//       name: 'The Sea Explorer',
//       rating: 4.8,
//       price: '799',
//     });
//     console.log(tour);
//   } catch (err) {
//     console.error(err);
//   }
// };

// seed();
