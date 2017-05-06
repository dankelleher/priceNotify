/**
 * Created by daniel on 23.04.17.
 */
import database from './database'

const client = database().client;

const tableName = "Alert";

export const create = (obj, cb) => {
  console.log("Adding a new item...");

  return client.put(
    {
      TableName: tableName,
      Item: obj
    }, cb);
};

export const read = (params, cb) => {
  return client.get(
    {
      TableName: tableName,
      Key: params
    }, cb);
};

export const find = (params, cb) => {
  return client.scan(
    {
      TableName: tableName,
      ...params
    }, cb);
};

export const update = (obj) => {
  // TODO
};

export const remove = (params) => {
  // TODO
};

