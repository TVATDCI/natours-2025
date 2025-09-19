const stripe = require('stripe')(process.env.STRIPE_TEST_KEY); // Must be on the top prior!

const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');

const factory = require('./handlerFactory');
// const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  console.log('⚡ getCheckoutSession called with:');
  console.log('tourId param:', req.params.tourId);
  console.log('user:', req.user && req.user.id);
  console.log('tour price:', tour.price);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    // Session infos
    payment_method_types: ['card'],
    mode: 'payment',
    // user comes back here after payment with option cancel(cancel_url)
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    // Product infos
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100, // cents
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `https://www.natours.dev/img/tours/${tour.imageCover}`, //   `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
            ],
          },
        },
        quantity: 1,
      },
    ],
  });

  // check success_url being sent to Stripe:
  console.log(
    'Generated success_url:',
    `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
  );

  // 3) Send session to client
  res.status(200).json({
    status: 'success',
    session,
  });
});

// TEMP: Create INSECURE booking middle without STRIPE WEBHOOK (HACK)
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  console.log('🎯 createBookingCheckout middleware HIT');
  console.log('🔎 Full req.url:', req.url);
  console.log('🔎 Full req.query:', req.query);

  const { tour, user, price } = req.query; // as in bookingModel.js

  if (!tour || !user || !price) {
    console.log('⚠️ Missing query params:', { tour, user, price });
    return next();
  }

  //if (!tour || !user || !price) return next();
  // if any one of those values (tour, user, or price) is missing/invalid, the condition is true.
  // Meaning: If ANY ONE of tour, user, or price is missing → skip creating the booking and call next()!
  // This is stricter and prevents half-baked bookings from being created.

  // if (!tour && !user && !price) return next(); // Jonas version - The condition is only true if all three are falsy at the same time.
  // Example: Scary version
  // tour ✅, user ✅, price ❌ → still creates a booking (with price = undefined 😬).
  // tour ✅, user ❌, price ✅ → still creates a booking (with user = undefined).
  // So unless all query params are missing at the same time, the booking gets created. That’s looser.

  console.log('Booking.create payload:', { tour, user, price });

  try {
    await Booking.create({ tour, user, price: +price });
    console.log('✅ Booking created');
  } catch (err) {
    console.error('❌ Booking failed:', err);
  }

  // More secure - Redirect to remove query params from URL
  // `${req.protocol}://${req.get('host')}/?tour
  res.redirect(req.originalUrl.split('?')[0]); // [0] = root url '/'
});

// CRUD operations (use factory functions for reusability)
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
