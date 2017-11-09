'use strict';

// var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  var login = sequelize.define('login', {
    email: DataTypes.STRING,
    password: DataTypes.STRING
  });

  login.beforeCreate(function (createdUser, options) {
    if (!createdUser.password) { return null; }
    // var hash = bcrypt.hashSync(createdUser.password, 10);
    var hash = Buffer.from(createdUser.password).toString('base64')
    createdUser.password = hash;
    return createdUser;
  });

  login.prototype.validPassword = function (password) {
    return Buffer.from(password).toString('base64') === this.password
    // return bcrypt.compareSync(password, this.password);
  };

  return login;
};
