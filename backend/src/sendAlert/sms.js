/**
 * Created by daniel on 03.05.17.
 */
import axios from 'axios';
import R from 'ramda';

const {ACCESS_KEY, ACCESS_SECRET, PLIVO_URL_TEMPLATE} = process.env;
const URL = PLIVO_URL_TEMPLATE.replace('{ACCESS_KEY}', ACCESS_KEY);

const getResponseData = R.prop('data');

export default R.curry(function(price, mobileNo) {
  return axios.post(URL, {
      'src': '491111111111',  // dummy number - can be anything as long as it's valid
      'dst': mobileNo,
      'text': 'Price: ' + price
    }, {
      headers: {
        'Accept': 'application/json',
      },
      auth: {
        username: ACCESS_KEY,
        password: ACCESS_SECRET
      }
    }).then(getResponseData);
});