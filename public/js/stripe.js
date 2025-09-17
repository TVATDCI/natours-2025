/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51S8ObTDyxIiaci9uJAmlHH9dV7igZcsVsLzpv3lrMqjSBleJRD6rs5CjbkjItnNfMcaVmllCZvQ5G0UQPV1axBZ900RoDqJd42',
);

export const bookTour = async (tourId) => {
  // 1) Get checkout session from API
  const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
  console.log();
  // 2) Redirect to Stripe checkout page
};
