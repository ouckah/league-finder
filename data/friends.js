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
  const result = await friendsCollection.updateMany(
    {
      $or: [
        { userId: frienderId, friendId: friendeeId },
        { userId: friendeeId, friendId: frienderId }
      ]
    },
    { $set: { status: "accepted" } }
  );

  if (result.modifiedCount === 0) {
    throw new Error("No pending friend request found to accept.");
  }
}

const unfriend = async (frienderId, friendeeId) => {
  helpers.checkId(frienderId)
  helpers.checkId(friendeeId)

  const friendsCollection = await friends()
  const result = await friendsCollection.deleteMany({
    $or: [
      { userId: frienderId, friendId: friendeeId, status: "accepted" },
      { userId: friendeeId, friendId: frienderId, status: "accepted" }
    ]
  });

  if (result.deletedCount === 0) {
    throw new Error("No accepted friendship found to remove.");
  }
}

const getFriends = async (userId) => {
  helpers.checkId(userId)

  const friendsCollection = await friends()
  const friendList = await friendsCollection.find({
    userId: new ObjectId(userId)
  })

  return Array.toArray(friendList)
}

const getFriendStatus = async (frienderId, friendeeId) => {
  helpers.checkId(frienderId)
  helpers.checkId(friendeeId)

  const friendsCollection = await friends()

  const relationship = await friendsCollection.findOne({
    $or: [
      { userId: frienderId, friendId: friendeeId },
      { userId: friendeeId, friendId: frienderId }
    ]
  })

  console.log(relationship)

  if (!relationship) {
    return "none"
  }

  return relationship.status
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
    userId: new ObjectId(userId),
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
      { userId: frienderId, friendId: friendeeId, status: "pending" },
      { userId: friendeeId, friendId: frienderId, status: "pending" }
    ]
  });
}

export {
  friend,
  unfriend,
  getFriends,
  getFriendStatus,
  createFriendRequest,
  deleteFriendRequest,
  getFriendRequests,
}