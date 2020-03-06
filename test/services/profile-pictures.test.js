const assert = require('assert');
const app = require('../../src/app');

describe('\'profilePictures\' service', () => {
  it('registered the service', () => {
    const service = app.service('profile-pictures');

    assert.ok(service, 'Registered the service');
  });
});
