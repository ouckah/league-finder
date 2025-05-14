import {users, votes} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';

const upvote = async (voterId, userId) => {
  helpers.checkId(voterId)
  helpers.checkId(userId)

  const usersCollection = await users()
  const votesCollection = await votes()

  const existingUpvote = await votesCollection.findOne({
    voterId,
    userId,
    type: "upvote",
  })
  if (existingUpvote) {
    return 0
  }

  let change = 1;

  const result = await votesCollection.findOneAndDelete({
    voterId,
    userId,
    type: "downvote",
  })

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

  const existingDownvote = await votesCollection.findOne({
    voterId,
    userId,
    type: "downvote",
  })
  if (existingDownvote) {
    return 0
  }

  let change = -1;

  const result = await votesCollection.findOneAndDelete({
    voterId,
    userId,
    type: "upvote",
  })

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