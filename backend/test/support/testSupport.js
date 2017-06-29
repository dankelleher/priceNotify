/**
 * Created by daniel on 06.05.17.
 */
export const toRegisterAlertEvent = (mobileNo, price) => {
  return {
    body: JSON.stringify({mobileNo, price})
  };
};

export const cbToPromise = (f) => {
  return (...args) => {
    return new Promise((resolve, reject) => {
      const cb = (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      };

      f(...args, cb);
    });
  };
};