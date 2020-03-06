// Initializes the `imageCommentaries` service on path `/image-commentaries`
const createService = require('feathers-mongoose');
const createModel = require('../../models/image-commentaries.model');
const hooks = require('./image-commentaries.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/image-commentaries', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('image-commentaries');

  service.hooks(hooks);
};
