'use strict';
module.exports = (sequelize, DataTypes) => {
  var currency_history = sequelize.define('currency_history', {
    currencyId: DataTypes.INTEGER,
    price: DataTypes.FLOAT
  });

  return currency_history;
};
