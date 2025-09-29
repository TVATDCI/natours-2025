const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
// https://docs.stripe.com/webhooks

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');

const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // console.log('⚡ getCheckoutSession called with:');
  // console.log('tourId param:', req.params.tourId);
  // console.log('user:', req.user && req.user.id);
  // console.log('tour price:', tour.price);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    // Session infos
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [
              `${req.protocol}://${req.get('host')}/img/-tours/${tour.image.Cover}`,
            ],
          },
        },
        quantity: 1,
      },
    ],
  });

  // 3) Send session to client
  res.status(200).json({
    status: 'success',
    session,
  });
});

// 4) Helper: actually create booking in DB
const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const userDoc = await User.findOne({ email: session.customer_email });
  if (!userDoc) {
    console.error(`⚠️ No user found for email: ${session.customer_email}`);
    return; // Avoid crashing
  }

  const user = userDoc.id;
  const price = session.line_items[0].amount_total / 100;
  await Booking.create({ tour, user, price });
};
//   res.redirect(req.originalUrl.split('?')[0]); // [0] = root url '/'
// });

// 5) Webhook endpoint (Stripe → backend)
exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

// 4) CRUD operations (use factory functions for reusability)
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
