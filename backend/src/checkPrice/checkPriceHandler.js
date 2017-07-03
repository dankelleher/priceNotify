/**
 * Created by daniel on 29.06.17.
 */
import R from 'ramda';
import axios from 'axios';

import publish from './sns';
import crud from '../common/db/crud'

const TABLE = 'Price';
const ACTIVATION_MARGIN = 1;  // a price variance of 1 EUR or more will send a notification
const CURRENCY = 'EUR';
const {PRICE_URL} = process.env;

const set = crud(TABLE).create;
const get = crud(TABLE).read;

const getPriceFromRemoteResponse = R.path(['data', CURRENCY, 'last']);
const getPriceFromDBResponse = R.path(['Item', 'price']);

export function check(event, context, callback) {
  checkPrice()
    .then(result => callback(null, result))
    .catch(callback);
}

async function checkPrice() {
  const [currentPrice, lastPrice = 0] = await Promise.all([getCurrentPrice(), getLastPrice()]);

  console.log(`currentPrice: ${currentPrice}, lastPrice: ${lastPrice}`);

  if (Math.abs(currentPrice - lastPrice) >= ACTIVATION_MARGIN) {
    console.log('Triggering notification');

    await publish({ lastPrice, price: currentPrice });

    // only update the price if it has changed significantly. Otherwise multiple small changes will go unnoticed.
    return updateLastPrice(currentPrice);
  }
}

function getCurrentPrice() {
  return axios.get(PRICE_URL).then(getPriceFromRemoteResponse);
}

function getLastPrice() {
  return get({currency: CURRENCY}).promise().then(getPriceFromDBResponse);
}

function updateLastPrice(price) {
  return set({ currency: CURRENCY, price }).promise();
}