// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
const dauria = require('dauria');
const errors = require('@feathersjs/errors');
const { Canvas, Image } = require('canvas');
const canvas = new Canvas();

function optimizeImage(uri) {
  const image = new Image();

  return new Promise((res, rej) => {
    image.onload = function () {
      // Resize the image
      let width = image.width,
        height = image.height;
      const max_size = 800;

      if (width > height) {
        if (width > max_size) {
          height *= max_size / width;
          width = max_size;
        }
      } else {
        if (height > max_size) {
          width *= max_size / height;
          height = max_size;
        }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(image, 0, 0, width, height);
      res(canvas.toDataURL('image/jpeg'));
    };
    image.src = uri;
  });
}
module.exports = function (maxSize = 15000000) {
  return async context => {
    const {data} = context;

    if (data.mimetype && !data.mimetype.startsWith('image/'))
      throw new errors.BadRequest('Bad file format, need an image file');
    if (data.size > maxSize)
      throw new errors.BadRequest('File is over 5MB');
    if (!data.buffer)
      throw new errors.BadRequest('No buffer field');
    const uri = dauria.getBase64DataURI(data.buffer, data.mimetype);
    return optimizeImage(uri)
      .then(opti => {
        console.log('Opti uri length: ', opti.length);
        context.data = { uri: uri, opti: opti };
        return context;
      });
  };
};
