require('dotenv').config({ silent: true });

const express = require('express');
const router = express.Router();
const rp = require('request-promise');
const http = require('http');

const db = require('../models/')

const CRYPTO_API_URL = process.env.CRYPTO_URL;
const COINS_METHOD = 'all/coinlist';

function separateOutput() {
  console.log('====================================');
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.status(200).render('index', { title: 'Crypto Tracking' });
});

router.get('/get-coins', (req, res, next) => {
  separateOutput();
  console.log('Calling 3rd party api...');
  console.log(`${CRYPTO_API_URL}/${COINS_METHOD}`);

  rp(`${CRYPTO_API_URL}/${COINS_METHOD}`)
  .then(coins => {
    console.log('Status:', JSON.parse(coins).Response);
    var coinData = JSON.parse(coins).Data;
    var baseUrl = JSON.parse(coins).BaseLinkUrl;
    var coinNames = Object.keys(coinData);
    console.log("Number of Coins:", coinNames.length);

    var coinList = [];

    for(let i in coinData) {
      coinList.push({
        'name': coinData[i].CoinName,
        'symbol': coinData[i].Symbol,
        'url': `${baseUrl}${coinData[i].Url}`,
        'imageUrl': `${baseUrl}${coinData[i].ImageUrl}`,
        'order': coinData[i].SortOrder
      })
    }

    db.currency.destroy({
      where: {},
      truncate: true
    });

    db.currency.bulkCreate(coinList, { individualHooks: true })
    .then(createdCoins => {
      separateOutput();
      console.log(`CREATED ${coinNames.length} CURRENCY RECORDS!!!`);
      separateOutput();
    });

    console.log('Done');
    separateOutput();
    res.status(200).render('partials/getCoins');
  })
  .catch(err => {
    console.log(err);
  })
});

module.exports = router;
