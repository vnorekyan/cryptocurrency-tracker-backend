var express = require('express');
var db = require('../models/')
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtCheck = require('express-jwt');

// GET /transactions
router.get('/', jwtCheck({ secret: process.env.SESSION_SECRET }), (req, res) => {
  db.transaction.findAll({
    where: {userId: req.user.id}
  })
  .then(transactions => {
    res.json(transactions);
  });
});

// POST /transactions
router.post('/', jwtCheck({ secret: process.env.SESSION_SECRET }), (req, res) => {
  db.transaction.create({
    currency: req.body.currency,
    price: req.body.price,
    quantity: req.body.quantity,
    buy: req.body.buy,
    userId: req.user.id
  })
  .then(transaction => {
    res.json(transaction);
  });
});

module.exports = router;
