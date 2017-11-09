'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('logins', [{
      email: 'email',
      password: 'password',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  down: function (queryInterface, Sequelize) {
  }
};
