const assert = require('assert');
const app = require('../../src/app');

describe('\'imageCommentaries\' service', () => {
  it('registered the service', () => {
    const service = app.service('image-commentaries');

    assert.ok(service, 'Registered the service');
  });
});
