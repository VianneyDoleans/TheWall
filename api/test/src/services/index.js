const users = require('./users/users.service.js');
const uploadImage = require('./upload-image/upload-image.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(uploadImage);
};
