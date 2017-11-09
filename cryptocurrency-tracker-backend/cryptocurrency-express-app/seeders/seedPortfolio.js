'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('user_portfolio', [{
            userId: 6,
            currencyId: 1,
            amount: 100,
            createdAt: new Date(),
            updatedAt: new Date()
        }], {});

    },

    down: function (queryInterface, Sequelize) {
    }
};
