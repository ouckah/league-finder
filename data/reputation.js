import {users} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';
import * as validation from '../utils/validation.js';

const upvote = async (userId) => {
  helpers.checkId(userId)

  const usersCollection = await users()
  await usersCollection.findOneAndUpdate(
    { _id: userId },
    { $inc: { reputation: 1 } },
  )
}

const downvote = async (userId) => {
  helpers.checkId(userId)

  const usersCollection = await users()
  await usersCollection.findOneAndUpdate(
    { _id: userId },
    { $inc: { reputation: -1 } },
  )
}

export {
  upvote,
  downvote,
}