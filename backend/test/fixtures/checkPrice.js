/**
 * Created by daniel on 29.06.17.
 */
import sinon from 'sinon';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import database from '../../src/common/db/database';
import {createSchema, tearDownSchema} from '../support/dbSupport';
import {cbToPromise} from '../support/testSupport';
import {check, __RewireAPI__ as checkPriceRewire } from '../../src/checkPrice/checkPriceHandler';

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

const DUMMY_PRICE = 2500.05;

const client = database().client;

let axiosStub, snsStub;

describe('checkPrice', function() {

  beforeEach(createSchema);
  beforeEach(() => {
    // stub the axios HTTP GET call to return a promise of a dummy EUR value
    axiosStub = sinon.stub();
    axiosStub.returns({then: (fn) => fn({ data: { EUR: { last: DUMMY_PRICE }}})});
    checkPriceRewire.__Rewire__('axios', {get : axiosStub});

    // stub the sns publish call
    snsStub = sinon.stub();
    snsStub.returns(Promise.resolve());
    checkPriceRewire.__Rewire__('publish', snsStub);
  });

  afterEach(tearDownSchema);
  afterEach(() => {
    checkPriceRewire.__ResetDependency__('axios');
    checkPriceRewire.__ResetDependency__('sns');
  });

  const checkPromise = cbToPromise(check);

  const getLatestPriceFromDB = () => client.get(
      {
        TableName: 'Price',
        Key: {currency: 'EUR'}
      }).promise();

  const setPriceInDB = (price) => client.put(
    {
      TableName: 'Price',
      Item: {currency: 'EUR', price}
    }).promise();

  it('should get the current price from the external API', async function () {
    await checkPromise(null, null);

    expect(axiosStub.calledOnce).to.be.true;
  });

  it('should update the current price in the database', async function () {
    await checkPromise(null, null);

    const {Item: {price: latestPrice}} = await getLatestPriceFromDB();

    latestPrice.should.equal(DUMMY_PRICE);
  });

  it('should send a price notification if the price has sufficiently changed', async function () {
    await checkPromise(null, null);

    expect(snsStub.calledOnce).to.be.true;
  });

  it('should not send a price notification if the price has not sufficiently changed', async function () {
    let negligibleAmount = 0.05;
    await setPriceInDB(DUMMY_PRICE - negligibleAmount);

    await checkPromise(null, null);

    expect(snsStub.calledOnce).to.be.false;
  });
});