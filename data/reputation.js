import {users, votes} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';
import * as validation from '../utils/validation.js';

const upvote = async (voterId, userId) => {
  helpers.checkId(voterId)
  helpers.checkId(userId)

  const usersCollection = await users()
  const votesCollection = await votes()

  let change = 1;

  const result = await votesCollection.findOneAndDelete({
    voterId,
    userId,
    type: "downvote",
  })

  console.log(result)

  if (result) {
    change += 1
  }

  await votesCollection.insertOne({
    voterId,
    userId,
    type: "upvote",
  })

  await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $inc: { reputation: change } },
  )

  return change
}

const downvote = async (voterId, userId) => {
  helpers.checkId(voterId)
  helpers.checkId(userId)

  const usersCollection = await users()
  const votesCollection = await votes()

  let change = -1;

  const result = await votesCollection.findOneAndDelete({
    voterId,
    userId,
    type: "upvote",
  })

  console.log(result)

  if (result) {
    change -= 1
  }

  await votesCollection.insertOne({
    voterId,
    userId,
    type: "downvote",
  })

  await usersCollection.findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $inc: { reputation: change } },
  )

  return change
}

const getStatus = async (voterId, userId) => {
  helpers.checkId(voterId)
  helpers.checkId(userId)

  const votesCollection = await votes()

  const vote = await votesCollection.findOne({
    voterId,
    userId,
  })

  if (!vote) return "none"

  return vote.type
}

export {
  upvote,
  downvote,
  getStatus,
}