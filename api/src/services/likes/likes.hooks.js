const { authenticate } = require('@feathersjs/authentication').hooks;
const auth = require('feathers-authentication-hooks');

const generateNotification = require('../../hooks/generate-notification');

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
        ownerField: 'authorId',
        owner: true
      }),
    ],
    patch: [
      auth.restrictToRoles({
      roles: ['admin'],
      fieldName: 'roles',
      idField: '_id',
      ownerField: 'authorId',
      owner: true
    }),],
    remove: [
      auth.restrictToRoles({
        roles: ['admin'],
        fieldName: 'roles',
        idField: '_id',
        ownerField: 'authorId',
        owner: true
      }),
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [generateNotification()],
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
