const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('module');
const path = require('node:path');

const bookingControllerPath = path.join(
  __dirname,
  '..',
  'controllers',
  'bookingController.js',
);

const createDeferred = () => {
  let resolve;
  let reject;

  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};

const loadWithMocks = (modulePath, mocks) => {
  const resolvedPath = require.resolve(modulePath);
  delete require.cache[resolvedPath];

  const originalLoad = Module._load;
  Module._load = function mockLoad(request, parent, isMain) {
    if (Object.prototype.hasOwnProperty.call(mocks, request)) {
      return mocks[request];
    }

    return originalLoad.call(this, request, parent, isMain);
  };

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(resolvedPath);
  } finally {
    Module._load = originalLoad;
  }
};

const createResponse = () => ({
  statusCode: null,
  payload: null,
  sent: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(payload) {
    this.payload = payload;
    return this;
  },
  send(payload) {
    this.sent = payload;
    return this;
  },
});

const loadBookingController = ({ constructEvent, userDoc, createBooking }) => {
  process.env.STRIPE_TEST_KEY = 'sk_test_mock';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_mock';

  return loadWithMocks(bookingControllerPath, {
    stripe: () => ({
      webhooks: {
        constructEvent,
      },
      checkout: {
        sessions: {
          create: async () => ({}),
        },
      },
    }),
    '../models/tourModel': {},
    '../models/userModel': {
      findOne: async () => userDoc,
    },
    '../models/bookingModel': {
      create: createBooking,
    },
  });
};

test('webhook waits for booking persistence before acknowledging success', async () => {
  const deferredBooking = createDeferred();
  const bookingController = loadBookingController({
    constructEvent: () => ({
      id: 'evt_awaited',
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: 'tour_123',
          customer_email: 'traveler@example.com',
          amount_total: 49900,
        },
      },
    }),
    userDoc: { id: 'user_123' },
    createBooking: async () => deferredBooking.promise,
  });

  const req = {
    headers: { 'stripe-signature': 'sig_mock' },
    body: Buffer.from('{}'),
  };
  const res = createResponse();
  const nextCalls = [];

  const handlerPromise = bookingController.webhookCheckout(req, res, (err) => {
    nextCalls.push(err);
  });

  await Promise.resolve();
  assert.equal(res.statusCode, null);
  assert.equal(nextCalls.length, 0);

  deferredBooking.resolve({ id: 'booking_123' });
  await handlerPromise;

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload, { received: true });
  assert.deepEqual(nextCalls, []);
});

test('webhook duplicate delivery keeps a single persisted booking', async () => {
  const persistedEventIds = new Set();
  const bookingController = loadBookingController({
    constructEvent: () => ({
      id: 'evt_duplicate',
      type: 'checkout.session.completed',
      data: {
        object: {
          client_reference_id: 'tour_456',
          customer_email: 'repeat@example.com',
          amount_total: 79900,
        },
      },
    }),
    userDoc: { id: 'user_456' },
    createBooking: async ({ stripeEventId }) => {
      if (persistedEventIds.has(stripeEventId)) {
        const error = new Error('Duplicate stripe event');
        error.code = 11000;
        error.keyPattern = { stripeEventId: 1 };
        throw error;
      }

      persistedEventIds.add(stripeEventId);
      return { id: `booking_${stripeEventId}` };
    },
  });

  const nextCalls = [];
  const makeRequest = () => ({
    headers: { 'stripe-signature': 'sig_duplicate' },
    body: Buffer.from('{}'),
  });

  const firstResponse = createResponse();
  await bookingController.webhookCheckout(
    makeRequest(),
    firstResponse,
    (err) => {
      nextCalls.push(err);
    },
  );

  const secondResponse = createResponse();
  await bookingController.webhookCheckout(
    makeRequest(),
    secondResponse,
    (err) => {
      nextCalls.push(err);
    },
  );

  assert.equal(firstResponse.statusCode, 200);
  assert.equal(secondResponse.statusCode, 200);
  assert.deepEqual(firstResponse.payload, { received: true });
  assert.deepEqual(secondResponse.payload, { received: true });
  assert.equal(persistedEventIds.size, 1);
  assert.deepEqual(nextCalls, []);
});
