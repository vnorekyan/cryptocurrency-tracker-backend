'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      first_name: 'fname',
      last_name: 'lname',
      email: 'email',
      balance: 1.00,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  down: function (queryInterface, Sequelize) {
  }
};
