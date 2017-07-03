import R from 'ramda';

import crud from '../common/db/crud'
import sendSMS from './sms'

const find = crud('Alert').find;
const snsMessageString = R.path(['Records', '0', 'Sns', 'Message']);
const snsMessageObject = R.compose(JSON.parse, snsMessageString);

export function send(event, context, callback) {
  const {lastPrice, price} = snsMessageObject(event);

  sendAlertsForPrice(lastPrice, price)
    .then((result) => callback(null, result))
    .catch(callback);
}

async function sendAlertsForPrice(lastPrice, price) {
  const sendAlertForRegistration = R.pipe(
    R.prop('mobileNo'),
    sendSMS(price)
  );

  const [minPrice, maxPrice] = (lastPrice < price) ? [lastPrice, price] : [price, lastPrice];

  const registrations = await findRegistrationsMatchingPrice(minPrice, maxPrice);
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
