// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const errors = require('@feathersjs/errors');

// eslint-disable-next-line no-unused-vars
module.exports = function () {
  return async context => {
    const { params, app } = context;
    const { query } = params;

    if (query.updateRolesOf && query.updateType && query.updateRole) {
      if (query.updateType === 'add') {
        return app.service('users').get(query.updateRolesOf)
          .then(user => {
            user.roles.push(query.updateRole);
            return app.service('users').patch(user._id, { roles: user.roles })
              .then(() => context);
          });
      } else if (query.updateType === 'remove') {
        return app.service('users').get(query.updateRolesOf)
          .then(user => {
            user.roles = user.roles.filter(r => r !== query.updateRole);
            return app.service('users').patch(user._id, { roles: user.roles })
              .then(() => context);
          });
      } else {
        throw new errors.BadRequest('Unknown updateType : ' + query.updateType + ', please use add or remove');
      }
    }
    return context;
  };
};
