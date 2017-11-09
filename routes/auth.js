var express = require('express');
var db = require('../models');
var passport = require('../config/ppConfig');
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtCheck = require('express-jwt');

router.get('/login', function(req, res) {
  res.render('partials/login');
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      return res.json(401, { error: 'Invalid email and/or password' });
    }

    //user has authenticated correctly thus we create a JWT token
      db.user.findById(user.id)
      .then(details => {
        const claims = {
          id: user.id,
          email: details.email,
          first_name: details.first_name,
          last_name: details.last_name,
          balance: details.balance,
          custom: 'User logged in.'
        };
        const options = { expiresIn: '2d' };

        var token = jwt.sign(claims, process.env.SESSION_SECRET, options);
        res.json({ token : token, user: claims });
      });
  }) (req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;
