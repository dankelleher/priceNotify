import { create } from '../common/db/crud'
import { parseBody } from '../common/lambdaIO'

export function register(event, context, callback) {
  const {mobileNo, price} = parseBody(event);

  return create({mobileNo, price}, callback);
}
