'use strict';
module.exports = (sequelize, DataTypes) => {
  var currency = sequelize.define('currency', {
    name: DataTypes.STRING,
    symbol: DataTypes.STRING,
    url: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    order: DataTypes.INTEGER
    // price: DataTypes.FLOAT
  });

  return currency;
};
