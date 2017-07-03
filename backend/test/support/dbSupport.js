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

const priceTable = {
  TableName : 'Price',
  KeySchema: [
    { AttributeName: 'currency', KeyType: 'HASH'},  //Partition key
  ],
  AttributeDefinitions: [
    { AttributeName: 'currency', AttributeType: 'S' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
};

const tables = [alertTable, priceTable];

const createTablePromise = table => db.createTable(table).promise();
const deleteTablePromise = table => db.deleteTable({TableName: table.TableName}).promise();


export const createSchema = () => {
  return Promise.all(tables.map(createTablePromise));
};

export const tearDownSchema = () => {
  return Promise.all(tables.map(deleteTablePromise));
};