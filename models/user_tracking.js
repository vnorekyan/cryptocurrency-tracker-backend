'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_tracking = sequelize.define('user_tracking', {
    userId: DataTypes.INTEGER,
    currencyId: DataTypes.INTEGER
  }, {
    freezeTableName: true
  });

  return user_tracking;
};
