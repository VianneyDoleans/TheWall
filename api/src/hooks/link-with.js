// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function () {
  return async context => {
    const { app, params, result, data } = context;

    if (params.query.linkWith === 'image') {
      app.service('images').get(params.query.linkId)
        .then(image => {
          console.log('Patching image : ', image);
          app.service('images').patch(params.query.linkId, { path: result.id, data: data.opti });
          if (image.path !== 'default.png') {
            app.service('user-images').remove(image.path);
          }
        });
    }
    if (params.query.linkWith === 'user') {
      app.service('users').get(params.query.linkId)
        .then(user => {
          console.log('Patching user : ', user);
          app.service('users').patch(params.query.linkId, { picture: result.id });
          if (user.path !== 'blank.png') {
            app.service('user-images').remove(user.path);
          }
        });
    }
    return context;
  };
};
