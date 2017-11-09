'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    balance: DataTypes.FLOAT
});

  return user;

};
