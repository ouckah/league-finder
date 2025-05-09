import {friends} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';

/*
  FRIEND CRUD
*/

const friend = async (frienderId, friendeeId) => {
  helpers.checkId(frienderId)
  helpers.checkId(friendeeId)

  const friendsCollection = await friends()
  await friendsCollection.updateMany(
    {
      $or: [
        { userId: ObjectId(frienderId), friendId: ObjectId(friendeeId) },
        { userId: ObjectId(friendeeId), friendId: ObjectId(frienderId) }
      ]
    },
    { $set: { status: "accepted" } }
  );
}

const unfriend = async (frienderId, friendeeId) => {
  helpers.checkId(frienderId)
  helpers.checkId(friendeeId)

  const friendsCollection = await friends()
  await friendsCollection.deleteMany({
    $or: [
      { userId: ObjectId(frienderId), friendId: ObjectId(friendeeId), status: "accepted" },
      { userId: ObjectId(friendeeId), friendId: ObjectId(frienderId), status: "accepted" }
    ]
  });
}

const getFriends = async (userId) => {
  helpers.checkId(userId)

  const friendsCollection = await friends()
  const friendList = await friendsCollection.find({
    userId: ObjectId(userId)
  })

  return Array.toArray(friendList)
}

/*
  FRIEND REQUEST CRUD
*/

const createFriendRequest = async (frienderId, friendeeId) => {
  helpers.checkId(frienderId)
  helpers.checkId(friendeeId)

  const friendsCollection = await friends()

  await friendsCollection.insertOne({
    userId: frienderId,
    friendId: friendeeId,
    status: "pending",
  })
}

const getFriendRequests = async (userId) => {
  helpers.checkId(userId)

  const friendsCollection = await friends()

  const friendRequestList = await friendsCollection.findMany({
    userId: ObjectId(userId),
    status: "pending",
  })

  return friendRequestList
}

const deleteFriendRequest = async (frienderId, friendeeId) => {
  helpers.checkId(frienderId)
  helpers.checkId(friendeeId)

  const friendsCollection = await friends()

  await friendsCollection.deleteMany({
    $or: [
      { userId: ObjectId(frienderId), friendId: ObjectId(friendeeId), status: "pending" },
      { userId: ObjectId(friendeeId), friendId: ObjectId(frienderId), status: "pending" }
    ]
  });
}

export {
  friend,
  unfriend,
  getFriends,
  createFriendRequest,
  deleteFriendRequest,
  getFriendRequests
}