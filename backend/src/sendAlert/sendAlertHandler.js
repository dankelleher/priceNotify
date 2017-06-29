import R from 'ramda';

import crud from '../common/db/crud'
import sendSMS from './sms'

const find = crud('Alert').find;

export function send(event, context, callback) {
  const {lastPrice, price} = event;

  sendAlertsForPrice(lastPrice, price)
    .then((result) => callback(null, result))
    .catch(callback);
}

async function sendAlertsForPrice(lastPrice, price) {
  const sendAlertForRegistration = R.pipe(
    R.prop('mobileNo'),
    sendSMS(lastPrice, price)
  );

  const registrations = await findRegistrationsMatchingPrice(lastPrice, price);
  const alertPromises = registrations.map(sendAlertForRegistration);

  return Promise.all(alertPromises);
}

function findRegistrationsMatchingPrice(minPrice, maxPrice) {
  return find({
    FilterExpression: 'price BETWEEN :min AND :max',
    ExpressionAttributeValues: {
      ':min': minPrice,
      ':max': maxPrice
    }
  }).promise()
    .then(R.prop('Items'));
}
