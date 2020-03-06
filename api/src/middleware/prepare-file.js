/* eslint-disable no-console */
module.exports = function () {
  return function preparePicture(req, res, next) {
    req.body = req.file;
    next();
  };
};
