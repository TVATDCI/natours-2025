const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('module');
const path = require('node:path');

const authControllerPath = path.join(
  __dirname,
  '..',
  'controllers',
  'authController.js',
);

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

const authController = loadWithMocks(authControllerPath, {
  '../models/userModel': {},
  '../utils/email': function Email() {},
});

test('restrictTo preserves allow and deny role behavior', () => {
  const middleware = authController.restrictTo('admin');

  let deniedError;
  middleware({ user: { role: 'user' } }, {}, (err) => {
    deniedError = err;
  });

  assert.equal(deniedError.statusCode, 403);
  assert.equal(
    deniedError.message,
    'You do not have permission to perform this action',
  );

  let allowCalled = false;
  middleware({ user: { role: 'admin' } }, {}, (err) => {
    assert.equal(err, undefined);
    allowCalled = true;
  });

  assert.equal(allowCalled, true);
});
