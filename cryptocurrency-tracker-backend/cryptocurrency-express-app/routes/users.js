var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('../config/ppConfig');
var isLoggedIn = require('../middleware/isLoggedIn');
var jwt = require('jsonwebtoken');
var jwtCheck = require('express-jwt');

/* GET. */
router.get('/signup', function (req, res, next) {
  res.render('partials/signup');
});

// POST /users/signup
router.post('/signup', function (req, res, next) {
  var createdLogin = null;

  db.login.findOrCreate({
      where: {
        email: req.body.email,
        password: req.body.password
      }
    })
    .spread((login, created) => {
      if (created) {

        createdLogin = login
        db.user.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            balance: 10000
          })
          .then(createdUser => {

            //user has authenticated correctly thus we create a JWT token
            const claims = {
              id: createdLogin.id,
              email: createdUser.email,
              first_name: createdUser.first_name,
              last_name: createdUser.last_name,
              balance: createdUser.balance,
              custom: 'User logged in.'
            };
            const options = {
              expiresIn: '2d'
            };

            const token = jwt.sign(claims, process.env.SESSION_SECRET, options);

            db.user_login.create({
                userId: createdUser.id,
                loginId: createdLogin.id
              })
              .then(joinEntry => {
                res.json({
                  token: token,
                  user: claims
                });
              })
              .catch(err => {
                res.json(err)
              });
          })
          .catch(err => {
            res.json(err)
          });
      } else {
        res.json({
          message: 'User name already exists.'
        });
      }
    })
    .catch(err => {
      res.json(err)
    });
});

// GET /user/profile
router.get('/profile', jwtCheck({
  secret: process.env.SESSION_SECRET
}), function (req, res, next) {
  db.user.findById(req.user.id).then(user => {
    res.json(user);
  });
});

// PUT /users/profile
router.put('/profile', jwtCheck({secret: process.env.SESSION_SECRET }), function (req, res, next) {
  db.user.findById(req.user.id).then(user => {
    user.update(req.body)
      .then(user => {
        res.json(user);
      });
  })

});

// PUT /users/balance
router.put('/balance', jwtCheck({secret: process.env.SESSION_SECRET }), function (req, res, next) {
  db.user.findById(req.user.id).then(user => {
    if(req.body.buy === true) {
      var newBalance = user.balance - parseInt(req.body.transactionValue);
    } else {
      var newBalance = user.balance + parseInt(req.body.transactionValue);
    }
    return user.update({
      balance: newBalance
    })
    .then(user => {
      res.json(user);
    });
  });
});

// DELETE /users/profile
router.delete('/', jwtCheck({ secret: process.env.SESSION_SECRET}),  (req, res, next) => {
  db.user.findById(req.user.id)
    .then(user => {
      user.destroy();
      res.json('DELETED');
    });
});

module.exports = router;
