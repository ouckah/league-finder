import {MongoClient} from 'mongodb';
import {mongoConfig} from './settings.js';
import dotenv from 'dotenv';

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  dotenv.config();

  if (!_connection) {
    _connection = await MongoClient.connect(process.env.MONGO_SERVER_URL);
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};
const closeConnection = async () => {
  await _connection.close();
};

export {dbConnection, closeConnection};
