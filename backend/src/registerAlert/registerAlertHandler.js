import crud from '../common/db/crud'
import { parseBody } from '../common/lambdaIO'

const create = crud('Alert').create;

export function register(event, context, callback) {
  const {mobileNo, price} = parseBody(event);

  return create({mobileNo, price}, callback);
}
