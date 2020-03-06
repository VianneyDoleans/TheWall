// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function () {
  return async context => {
    const { app, result } = context;

    app.service('images').remove(null, { query: { author: result._id } });
    app.service('image-commentaries').remove(null, { query: { author: result._id } });
    return context;
  };
};
