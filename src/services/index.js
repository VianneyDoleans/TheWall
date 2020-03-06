const users = require('./users/users.service.js');
const uploadImage = require('./upload-image/upload-image.service.js');
const images = require('./images/images.service.js');
const imageCommentaries = require('./image-commentaries/image-commentaries.service.js');
const likes = require('./likes/likes.service.js');
const tags = require('./tags/tags.service.js');
const notifications = require('./notifications/notifications.service.js');
// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(users);
  app.configure(uploadImage);
  app.configure(images);
  app.configure(imageCommentaries);
  app.configure(likes);
  app.configure(tags);
  app.configure(notifications);
};
