// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
const dauria = require('dauria');
const errors = require('@feathersjs/errors');

module.exports = function (maxSize = 5000000) {
  return async context => {
    const {data} = context;

    if (data.mimetype && !data.mimetype.startsWith('image/'))
      throw new errors.BadRequest('Bad file format, need an image file');
    if (data.size > maxSize)
      throw new errors.BadRequest('File is over 5MB');
    if (!data.buffer)
      throw new errors.BadRequest('No buffer field');
    const uri = dauria.getBase64DataURI(data.buffer, data.mimetype);
    context.data = {uri: uri};
    return context;
  };
};
