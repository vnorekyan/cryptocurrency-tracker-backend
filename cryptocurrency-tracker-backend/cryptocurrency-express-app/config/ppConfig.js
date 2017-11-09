var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');

// passport.serializeUser(function(user, done) {
//   return done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   var userInfo;
//   db.login.findById(id)
//   .then(function(user) {
//     userInfo = user;
//     db.user.findById(id)
//     .then(details => {
//       userInfo.details = details;
//       return done(null, userInfo);
//     }).catch(done);
//   }).catch(done);
// });

passport.use(new LocalStrategy({ usernameField: 'email' }, function(email, password, done) {
  db.login.find({
    where: { email: email }
  }).then(function(user) {
    if (!user || !user.validPassword(password)) {
      done(null, false);
    } else {
      done(null, user);
    }
  }).catch(done);
}));

module.exports = passport;
