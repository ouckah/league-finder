import {users} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';
import * as validation from '../utils/validation.js';

const upvote = async (userId) => {
  const usersCollection = await users()
}

const downvote = async (userId) => {
  const usersCollection = await users()
}

export {
  upvote,
  downvote,
}