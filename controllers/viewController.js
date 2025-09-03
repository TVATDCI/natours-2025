// controllers/viewController.js

// Mock data (temporary, later we get it from DB)
const tours = [
  { name: 'The Forest Hiker', duration: 5, price: 497 },
  { name: 'The Sea Explorer', duration: 7, price: 997 },
];

exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
};

exports.getTour = (req, res) => {
  const tour = { name: 'The Forest Hiker', duration: 5, price: 497 };
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour,
  });
};

// ======================================
// Mock Data (for testing only)
// ======================================
// const tours = [
//   { name: 'The Forest Hiker', duration: 5, price: 497 },
//   { name: 'The Sea Explorer', duration: 7, price: 997 },
// ];

// const tour = { name: 'The Forest Hiker', duration: 5, price: 497 };

// ======================================
// 3) ROUTES from app.js
// ======================================

// Root — for testing base layout directly
// app.get('/', (req, res) => {
//   const user = { name: 'TVATDCI' };
//   res
//     .status(200)
//     .render('base', { user, tours, sampleTour: 'The Forest Hiker' });
// });

// // Overview — list of tours
// app.get('/overview', (req, res) => {
//   const user = { name: 'TVATDCI' };
//   res.status(200).render('overview', { title: 'All Tours', tours, user });
// });

// // Tour — single tour
// app.get('/tour', (req, res) => {
//   const user = { name: 'TVATDCI' };
//   res
//     .status(200)
//     .render('tour', { title: 'The Forest Hiker Tour', tour, user });
// });
