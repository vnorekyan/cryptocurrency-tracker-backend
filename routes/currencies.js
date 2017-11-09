var express = require('express');
var db = require('../models/')
var router = express.Router();
var jwt = require('jsonwebtoken');
var jwtCheck = require('express-jwt');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// GET /currency/tracking
router.get('/tracking', jwtCheck({
  secret: process.env.SESSION_SECRET
}), (req, res) => {
  var i = 0
  var containInfo = [];

  db.user_tracking.findAll({
      where: {
        userId: req.user.id
      }
    })
    .then(currencies => {
      console.log('why')
      // To get details on currency (since user_tracking only gives id).
      var findCurrencyInfo = (array) => {
        db.currency.findById(array[i].currencyId)
          .then(currency => {
            containInfo.push(currency);
            i++;
            if (i === array.length) {
              res.status(200).json(containInfo);
            } else {
              return findCurrencyInfo(array);
            }
          })
      };
      return findCurrencyInfo(currencies);
    });
});

// GET /currency/tracking/id
router.get('/tracking/:id', jwtCheck({
  secret: process.env.SESSION_SECRET
}), (req, res) => {
  db.user_tracking.findById(req.params.id, {
      where: {
        userId: req.user.id
      }
    })
    .then(currency => {
      db.currency.findById(currency.currencyId)
        .then(currency => {
          res.json(currency);
        });
    });
});

// POST /currency/tracking
router.post('/tracking', jwtCheck({
  secret: process.env.SESSION_SECRET
}), (req, res) => {
  // db.user_tracking.create({
  //     userId: req.user.id,
  //     currencyId: req.body.currencyId
  //   })
  //   .then(currency => {
  //     res.json(currency);
  //   });

  db.user_tracking.findOrCreate({
      where: {
        userId: req.user.id,
        currencyId: req.body.currencyId
      }
    })
    .then(currency => {
      res.json(currency);
    });
});

// DELETE /currency/tracking/id
router.delete('/tracking/:id', jwtCheck({
  secret: process.env.SESSION_SECRET
}), (req, res) => {
  db.user_tracking.findOne({
      where: {
        userId: req.user.id,
        currencyId: req.params.id
      }
    })
    .then(currency => {
      if (currency) {
        return currency.destroy();
      } else {
        res.json('cannot delete');
      }
    })
    .then(currency => {
      res.json('DELETED');
    });
});



// GET /currency/portfolio - all currencies in portfolio
router.get('/portfolio', jwtCheck({
  secret: process.env.SESSION_SECRET
}), (req, res, next) => {

  var i = 0
  var containInfo = [];

  if (req.query.name) {
    db.user_portfolio.findAll({
        where: {
          userId: req.user.id
        }
      })
      .then(currencies => {
        var findCurrencyInfo = (array) => {
          db.currency.findAll({
              where: {
                id: array[i].currencyId,
                name: {
                  [Op.like]: req.query.name + '%'
                }
              }
            })
            .then(currency => {
              if (currency.length !== 0) {
                containInfo.push({
                  currency: currency,
                  amount: array[i].amount
                });
              }
              i++;
              if (i === array.length) {
                res.json(containInfo);
              } else {
                return findCurrencyInfo(array);
              }
            });
        };
        return findCurrencyInfo(currencies);
      });
  } else {
    db.user_portfolio.findAll({
        where: {
          userId: req.user.id
        },
      })
      .then(currencies => {

        var findCurrencyInfo = (array) => {
          db.currency.findById(array[i].currencyId)
            .then(currency => {
              containInfo.push({
                currency: currency,
                amount: array[i].amount,
                purchasedPrice: array[i].purchasedPrice
              });
              i++;
              if (i === array.length) {
                res.json(containInfo);
              } else {
                return findCurrencyInfo(array);
              }
            })
        };
        return findCurrencyInfo(currencies);
      });
  }

});

// POST /currency/portfolio  - update transactions table and user balance
router.post('/portfolio', jwtCheck({
  secret: process.env.SESSION_SECRET
}), (req, res, next) => {
  db.user_portfolio.findOrCreate({
      where: {
        userId: req.user.id,
        currencyId: req.body.currencyId
      },
      defaults: {
        amount: req.body.amount,
        purchasedPrice: req.body.value
      }
    })
    //if buying, increase amount in portfolio and update purchased price to reflect
    //else, decrease amount in portfolio
    .spread((currency, created) => {
      console.log('currency', currency, created)
      if (!created) {
        if (req.body.buy === true) {
          var newAmount = parseInt(req.body.amount) + currency.amount;
          var purchasedValue = parseInt(req.body.value) + currency.purchasedPrice;
        } else {
          var newAmount = currency.amount - parseInt(req.body.amount);
          var purchasedValue = currency.purchasedPrice - parseInt(req.body.value);
        }
        if (newAmount === 0) {
          currency.destroy();
          res.json('DELETED');
        } else {
          return currency.update({
              amount: newAmount,
              purchasedPrice: purchasedValue
            })
            .then(currency => {
              res.json(currency);
            })
        }
      } else {
        res.json(currency);
      }
    })
});

// PUT /currency/portfolio/id - update transactions table and user balance
router.put('/portfolio/:id', jwtCheck({
  secret: process.env.SESSION_SECRET
}), (req, res, next) => {
  db.user_portfolio.findById(req.params.id, {
      where: {
        userId: req.user.id
      }
    })
    .then(function (currency) {
      return currency.update({
        amount: req.body.amount,
        purchasedPrice: req.body.purchasedPrice
      });
    })
    .then(currency => {
      res.json(currency);
    });
});


// DELETE /currency/portfolio/id - update transaction table and user balance
router.delete('/portfolio/:id', jwtCheck({
  secret: process.env.SESSION_SECRET
}), (req, res, next) => {
  db.user_portfolio.findById(req.params.id, {
      where: {
        userId: req.user.id
      }
    })
    .then(currency => {
      currency.destroy();
    })
    .then(currency => {
      res.json('DELETED');
    });
});

// GET /currency/  - all currencies
router.get('/', (req, res) => {

  console.log(req.query);
  if (req.query.name) {
    db.currency.findAll({
        where: {
          name: {
            [Op.like]: req.query.name + '%'
          }
        }
      })
      .then(currency => {
        if (currency) {
          res.json(currency);
        } else {
          res.json({
            "Error": `Currency \'${req.query.name}\' not found`
          });
        }
      });
  } else {
    db.currency.findAll({
        order: [
          // Will escape username and validate DESC against a list of valid direction parameters
          ['order', 'ASC'],
        ],
        limit: 100
      })
      .then(currencies => {
        res.json(currencies);
      });
  }
});

// POST /currency
router.post('/', (req, res) => {
  db.currency.create({
      name: req.body.name
    })
    .then(currency => {
      res.json(currency);
    });
});

// GET /currency/id
router.get('/:id', (req, res) => {
  db.currency.findById(req.params.id)
    .then(currency => {
      res.json(currency);
    });
});



// DELETE /currency/id
router.delete('/:id', (req, res) => {
  db.currency.findById(req.params.id)
    .then(currency => {
      currency.destroy();
    })
    .then(currency => {
      res.send('DELETED');
    });
});


module.exports = router;