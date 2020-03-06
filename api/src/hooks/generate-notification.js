// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function () {
  return async context => {
    const {result, params, path, app} = context;
    const image = await app.service('images').get(result.imageId);

    console.log(path);
    if (path === 'likes')
    {
      return app.service('notifications').create(
        {
          type: 'like',
          data: result,
          imageId: result.imageId,
          authorId: params.user._id,
          receiver: image.author,
        }).then(() => context);
    }
    else
    {
      return app.service('notifications').create(
        {
          type: 'commentary',
          data: result,
          imageId: result.imageId,
          authorId: params.user._id,
          receiver: image.author,
        }).then(() => context);
    }
  };
};
