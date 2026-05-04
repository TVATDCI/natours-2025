const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
// https://docs.stripe.com/webhooks

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

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
              `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
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

const isDuplicateStripeEventError = (error) =>
  error &&
  error.code === 11000 &&
  (error.keyPattern?.stripeEventId || error.keyValue?.stripeEventId);

// 4) Helper: actually create booking in DB
const createBookingCheckout = async (session, eventId) => {
  const tour = session.client_reference_id;
  const customerEmail = session.customer_email;
  const amountTotal = session.amount_total;

  if (!eventId)
    throw new AppError('Stripe event ID is required for booking.', 500);

  if (!tour || !customerEmail || amountTotal == null)
    throw new AppError(
      'Stripe checkout session is missing required booking fields.',
      500,
    );

  const userDoc = await User.findOne({ email: customerEmail });
  if (!userDoc)
    throw new AppError('No user found for Stripe checkout session.', 500);

  try {
    await Booking.create({
      tour,
      user: userDoc.id,
      price: amountTotal / 100,
      stripeEventId: eventId,
    });
  } catch (error) {
    if (isDuplicateStripeEventError(error)) return;
    throw error;
  }
};

// 5) Webhook endpoint (Stripe → backend)
exports.webhookCheckout = catchAsync(async (req, res) => {
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
    await createBookingCheckout(event.data.object, event.id);

  res.status(200).json({ received: true });
});

// 4) CRUD operations (use factory functions for reusability)
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
