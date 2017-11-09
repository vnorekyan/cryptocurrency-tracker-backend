'use strict';
module.exports = (sequelize, DataTypes) => {
  var transaction = sequelize.define('transaction', {
    currency: DataTypes.STRING,
    price: DataTypes.FLOAT,
    quantity: DataTypes.FLOAT,
    buy: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER
  });

  return transaction;
};
