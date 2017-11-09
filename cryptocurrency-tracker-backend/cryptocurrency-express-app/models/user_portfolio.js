'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_portfolio = sequelize.define('user_portfolio', {
    userId: DataTypes.INTEGER,
    currencyId: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    purchasedPrice: DataTypes.FLOAT
  }, {
    freezeTableName: true
  });

  return user_portfolio;
};
