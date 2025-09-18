/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY);

export const bookTour = async (tourId) => {
  if (typeof Stripe === 'undefined') {
    console.error('❌ Stripe not loaded on page!');
    return;
  }
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Redirect to Stripe checkout page
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error(err);
    showAlert('error', 'Payment failed! Please try again later.');
  }
};
