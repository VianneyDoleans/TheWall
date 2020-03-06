// Initializes the `uploadPicture` service on path `/upload-picture`
const hooks = require('./upload-image.hooks');
const BlobStore = require('google-drive-blobs');
const blobService = require('feathers-blob');

module.exports = function (app) {
  const blobStore = BlobStore(
    { client_id: process.env.googleClientId, client_secret: process.env.googleClientSecret, refresh_token: process.env.googleToken }
  );

  app.use('/upload-image', blobService({ Model: blobStore }));

  // Get our initialized service so that we can register hooks
  const service = app.service('upload-image');
  service.hooks(hooks);
  service.timeout = 15000;
};
