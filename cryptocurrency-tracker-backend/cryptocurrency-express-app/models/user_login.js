'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_login = sequelize.define('user_login', {
    userId: DataTypes.INTEGER,
    loginId: DataTypes.INTEGER
  }, {
    freezeTableName: true
  });

  return user_login;
};
