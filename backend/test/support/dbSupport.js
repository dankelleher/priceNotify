/**
 * Created by daniel on 27.04.17.
 */
import database from '../../src/common/db/database'

const db = database({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
}).db;

const alertTable = {
  TableName : 'Alert',
  KeySchema: [
    { AttributeName: 'mobileNo', KeyType: 'HASH'},  //Partition key
    { AttributeName: 'price', KeyType: 'RANGE' }  // Search key
  ],
  AttributeDefinitions: [
    { AttributeName: 'mobileNo', AttributeType: 'S' },
    { AttributeName: 'price', AttributeType: 'N' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
};

export const createSchema = () => {
  return db.createTable(alertTable).promise();
};

export const tearDownSchema = () => {
  return db.deleteTable({TableName: alertTable.TableName}).promise();
};