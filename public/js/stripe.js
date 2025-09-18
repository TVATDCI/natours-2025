/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51S8ObTDyxIiaci9uJAmlHH9dV7igZcsVsLzpv3lrMqjSBleJRD6rs5CjbkjItnNfMcaVmllCZvQ5G0UQPV1axBZ900RoDqJd42',
);

export const bookTour = async (tourId) => {
  if (typeof Stripe === 'undefined') {
    console.error('❌ Stripe not loaded on page!');
    return;
  }
  try {
    // 1) Get checkout-session from the server (API endpoint)
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    // 2) Redirect to Stripe checkout page
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error(err);
    showAlert('error', 'Payment failed! Please try again later.');
  }
};
