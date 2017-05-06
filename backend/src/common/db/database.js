/**
 * Created by daniel on 06.05.17.
 */
import * as AWS from 'aws-sdk';

export default function(config) {
  if (config) {
    AWS.config.update(config);
  }

  return {
    db: new AWS.DynamoDB(),
    client: new AWS.DynamoDB.DocumentClient()
  };
};