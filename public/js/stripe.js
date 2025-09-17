/* eslint-disable */

const stripe = Stripe(
  'pk_test_51S8ObTDyxIiaci9uJAmlHH9dV7igZcsVsLzpv3lrMqjSBleJRD6rs5CjbkjItnNfMcaVmllCZvQ5G0UQPV1axBZ900RoDqJd42',
);

export const bookTour = async (tourId) => {
  // 1) Get checkout session from API
  // 2) Redirect to Stripe checkout page
};
