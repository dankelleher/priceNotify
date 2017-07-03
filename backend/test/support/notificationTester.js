// small script to test AWS notification sending functionality - do not run as part of unit tests
// run using: babel-node notificationTester.js
import * as AWS from 'aws-sdk';
import publish from '../../src/checkPrice/sns';

AWS.config.update({
  region: 'us-east-1',
});
const log = (data) => console.log(data);

publish({price: 123}).then(log, log);