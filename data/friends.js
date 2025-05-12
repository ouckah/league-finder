import {users} from '../config/mongoCollections.js'
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
        { userId: frienderId, friendId: friendeeId, status: "pending" },
        { userId: friendeeId, friendId: frienderId, status: "pending" }
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

  const usersCollection = await users()
  const friendsCollection = await friends()

  const friendsList = await friendsCollection.find({
    status: "accepted",
    $or: [
      { userId: userId },
      { friendId: userId }
    ]
  }).toArray();

  const populatedFriendsList = await Promise.all(
    friendsList.map(async (f) => {
      const otherUserId =
        f.userId.toString() === userId ? f.friendId : f.userId;

      const otherUser = await usersCollection.findOne({ _id: new ObjectId(otherUserId) });

      return {
        ...f,
        friendUser: otherUser
          ? {
              _id: otherUser._id,
              username: otherUser.username,
              profilePicture: otherUser.profilePicture,
              riotId: otherUser.riotId,
              region: otherUser.region,
              rank: otherUser.rank
            }
          : null,
      };
    })
  )

  return populatedFriendsList
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

  const usersCollection = await users()
  const friendsCollection = await friends()

  const friendRequestList = await friendsCollection.find({
    friendId: userId,
    status: "pending",
  }).toArray()

  const populatedRequestsList = await Promise.all(
    friendRequestList.map(async (req) => {
      const sender = await usersCollection.findOne({ _id: new ObjectId(req.userId) });
      return {
        ...req,
        fromUser: sender ? { _id: sender._id, username: sender.username } : null,
      };
    })
  );

  return populatedRequestsList
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