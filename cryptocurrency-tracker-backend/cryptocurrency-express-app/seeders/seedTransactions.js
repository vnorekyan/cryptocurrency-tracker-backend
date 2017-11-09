'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('transactions', [{
      currency: 'currency',
      price: 1.00,
      quantity: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  down: function (queryInterface, Sequelize) {
  }
};
