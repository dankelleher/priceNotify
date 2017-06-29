import {expect} from 'chai'

import database from '../../src/common/db/database';
import {createSchema, tearDownSchema} from '../support/dbSupport';
import {toRegisterAlertEvent, cbToPromise} from '../support/testSupport';
import {register} from '../../src/registerAlert/registerAlertHandler';

const client = database().client;

describe('registerAlert', function() {

  beforeEach(createSchema);
  afterEach(tearDownSchema);

  const registerPromise = cbToPromise(register);

  const getByMobileNo = (mobileNo) => {
    return client.query({
        TableName: 'Alert',
        KeyConditionExpression: '#m = :mob',
        ExpressionAttributeNames:{
          '#m': 'mobileNo'
        },
        ExpressionAttributeValues: {
          ':mob':mobileNo
        }
      }).promise();
  };

  const mobileNo = '12345';

  it('should register an alert for a given price', async function() {
    const price = 123;
    await registerPromise(toRegisterAlertEvent(mobileNo, price), null);

    const savedAlerts = await getByMobileNo(mobileNo);

    expect(savedAlerts.Items).to.have.lengthOf(1);
    expect(savedAlerts.Items[0].price).to.equal(price)
  });

  it('should add an alert for a new price', async function() {
    const price1 = 123;
    const price2 = 456;

    await registerPromise(toRegisterAlertEvent(mobileNo, price1), null);
    await registerPromise(toRegisterAlertEvent(mobileNo, price2), null);

    const savedAlerts = await getByMobileNo(mobileNo);

    expect(savedAlerts.Items).to.have.lengthOf(2);
  });
});
