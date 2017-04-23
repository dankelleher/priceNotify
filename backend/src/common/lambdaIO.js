/**
 * Created by daniel on 20/02/2017.
 *
 * Helper functions to handle IO with AWS Lambda
 */

export function creationResponse(generatedId) {
  return {
    ...successfulResponse(),
    body: JSON.stringify({
      message: 'Created successfully',
      id: generatedId,
    }),
  };
}

export function getResponse(entity) {
  return {
    ...successfulResponse(),
    body: JSON.stringify(entity),
  };
}

export function throwOnError(err) {
  throw err;
}

export function parseBody(event) {
  return JSON.parse(event.body);
}

function successfulResponse() {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin" : "*" // Required for CORS support to work
    },
  }
}