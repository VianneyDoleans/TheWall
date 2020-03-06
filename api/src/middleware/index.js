const prepareFile = require('./prepare-file');
const multer = require('multer');
const upload = multer();

// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  // Adding an upload/picture endpoint
  // Be aware the file need to be avatar
  app.use('/upload-image', upload.single('avatar'), prepareFile());
};
