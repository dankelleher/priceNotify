// small script to test SMS sending functionality - do not run as part of unit tests
// run using: babel-node smsTester.js
import sendSMS from '../../src/sendAlert/sms'

sendSMS(111.11, '491733773919').then(response => {
  console.log(response);
});