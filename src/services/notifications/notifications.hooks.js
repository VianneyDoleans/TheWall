const { authenticate } = require('@feathersjs/authentication').hooks;
const auth = require('feathers-authentication-hooks');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [
      auth.restrictToRoles({
        roles: ['admin'],
        fieldName: 'roles',
        idField: '_id',
        ownerField: 'receiver',
        owner: true
      })
    ],
    patch: [
      auth.restrictToRoles({
        roles: ['admin'],
        fieldName: 'roles',
        idField: '_id',
        ownerField: 'receiver',
        owner: true
      })
    ],
    remove: [
      auth.restrictToRoles({
        roles: ['admin'],
        fieldName: 'roles',
        idField: '_id',
        ownerField: 'receiver',
        owner: true
      })
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
