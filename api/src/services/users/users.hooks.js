const { authenticate } = require('@feathersjs/authentication').hooks;
const auth = require('feathers-authentication-hooks');
const {
  hashPassword, protect
} = require('@feathersjs/authentication-local').hooks;
const updateRoles = require('../../hooks/update-roles');

const removeDependencies = require('../../hooks/remove-dependencies');

module.exports = {
  before: {
    all: [],
    find: [
      authenticate('jwt'),
    ],
    get: [
      authenticate('jwt'),
    ],
    create: [ hashPassword() ],
    update: [
      hashPassword(),
      authenticate('jwt'),
      auth.restrictToRoles({
        roles: ['admin'],
        fieldName: 'roles',
        idField: 'email',
        ownerField: 'email',
        owner: true
      }),
    ],
    patch: [
      hashPassword(),
      authenticate('jwt'),
      auth.restrictToRoles({
        roles: ['admin'],
        fieldName: 'roles',
        idField: 'email',
        ownerField: 'email',
        owner: true
      }),
    ],
    remove: [
      authenticate('jwt'),
      auth.restrictToRoles({
        roles: ['admin'],
        fieldName: 'roles',
        idField: 'email',
        ownerField: 'email',
        owner: true
      }),
    ]
  },

  after: {
    all: [ 
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [ updateRoles() ],
    remove: [ removeDependencies() ]
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
