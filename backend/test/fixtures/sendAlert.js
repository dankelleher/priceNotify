/**
 * Created by daniel on 06.05.17.
 */
import sinon from 'sinon';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import {createSchema, tearDownSchema} from '../support/dbSupport';
import {toRegisterAlertEvent, cbToPromise} from '../support/testSupport';
import {register} from '../../src/registerAlert/registerAlertHandler';
import {send, __RewireAPI__ as sendSMSRewire } from '../../src/sendAlert/sendAlertHandler';

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

let sendSMSStub;

describe('sendAlert', function() {

  beforeEach(createSchema);
  beforeEach(() => {
    sendSMSStub = sinon.stub();
    sendSMSRewire.__Rewire__('sendSMS', () => sendSMSStub);
  });

  afterEach(tearDownSchema);

  const registerPromise = cbToPromise(register);
  const sendPromise = cbToPromise(send);

  const mobileNo = '12345';
  const lastPrice = 120;
  const alertPrice = 123;
  const currentPrice = 125;

  const registerAlert = () => registerPromise(toRegisterAlertEvent(mobileNo, alertPrice), null);

  beforeEach(registerAlert);

  it('should send an SMS for a registered alert if the price is equal', async function () {
    sendSMSStub.returns(Promise.resolve("SMS Sent"));

    await sendPromise({lastPrice, price: alertPrice}, null);

    expect(sendSMSStub.calledOnce).to.be.true;
  });

  it('should send an SMS for a registered alert if the alert price is between the last and current price', async function () {
    sendSMSStub.returns(Promise.resolve("SMS Sent"));

    await sendPromise({lastPrice, price: currentPrice}, null);

    expect(sendSMSStub.calledOnce).to.be.true;
  });

  it('should send an SMS for a registered alert if the alert price is outside the last and current price', async function () {
    sendSMSStub.returns(Promise.resolve("SMS Sent"));

    const minorPriceIncrease = lastPrice + 1;

    await sendPromise({lastPrice, price: minorPriceIncrease}, null);

    expect(sendSMSStub.calledOnce).to.be.false;
  });

  it('should fail if an SMS fails to send', async function () {
    sendSMSStub.throws(Error);

    return sendPromise({lastPrice, price: currentPrice}, null).should.be.rejected;
  });

  it('should send the other SMSes if one fails', async function () {
    // register two more alerts
    await registerPromise(toRegisterAlertEvent('12346', alertPrice), null);
    await registerPromise(toRegisterAlertEvent('12347', alertPrice), null);

    sendSMSStub.onCall(0).returns(Promise.reject("SMS Failed"));
    sendSMSStub.onCall(1).returns(Promise.resolve("SMS Sent"));
    sendSMSStub.onCall(2).returns(Promise.resolve("SMS Sent"));

    const sendPromiseResult = sendPromise({lastPrice, price: currentPrice}, null);

    await sendPromiseResult.should.be.rejected;

    expect(sendSMSStub.calledThrice).to.be.true;
  });
});