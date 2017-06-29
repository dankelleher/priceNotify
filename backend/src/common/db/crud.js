/**
 * Created by daniel on 23.04.17.
 */
import database from './database'

const client = database().client;

export default (tableName) => ({

  create: (obj, cb) => {
    console.log("Adding a new item...");

    return client.put(
      {
        TableName: tableName,
        Item: obj
      }, cb);
  },

  read: (params, cb) => {
    return client.get(
      {
        TableName: tableName,
        Key: params
      }, cb);
  },

  find: (params, cb) => {
    return client.scan(
      {
        TableName: tableName,
        ...params
      }, cb);
  },

  update: (obj) => {
    // TODO
  },

  remove: (params) => {
    // TODO
  }
})

