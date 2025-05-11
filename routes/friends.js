import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import * as friendsData from '../data/friends.js'
import { protectedRoute } from '../utils/middleware.js';

const getFriendsHandler = async (req, res) => {
  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    const friends = await friendsData.getFriends(owner)
    return res.status(200).json(friends)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const postFriendHandler = async (req, res) => {
  const { friendId } = req.body

  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
    helpers.checkId(friendId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    await friendsData.friend(owner, friendId)
    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const deleteFriendHandler = async (req, res) => {
  const { friendId } = req.body

  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
    helpers.checkId(friendId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    await friendsData.unfriend(owner, friendId)
    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getFriendRequestsHandler = async (req, res) => {
  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    const friendRequests = await friendsData.getFriendRequests(owner)
    return res.status(200).json(friendRequests)
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const postFriendRequestHandler = async (req, res) => {
  const { friendId } = req.body

  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
    helpers.checkId(friendId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    await friendsData.createFriendRequest(owner, friendId)
    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const deleteFriendRequestHandler = async (req, res) => {
  const { friendId } = req.body

  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
    helpers.checkId(friendId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    await friendsData.deleteFriendRequest(owner, friendId)
    return res.status(200).json({ success: true })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

const getFriendStatusHandler = async (req, res) => {
  const { friendId } = req.params 

  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
    helpers.checkId(friendId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    const status = await friendsData.getFriendStatus(owner, friendId)
    return res.status(200).json({ status })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

router.
  route('/manage'). 
  all(protectedRoute). 
  get(getFriendsHandler). 
  post(postFriendHandler). 
  delete(deleteFriendHandler)

router. 
  route('/request'). 
  all(protectedRoute). 
  get(getFriendRequestsHandler). 
  post(postFriendRequestHandler). 
  delete(deleteFriendRequestHandler)

router. 
  route('/status/:friendId'). 
  all(protectedRoute). 
  get(getFriendStatusHandler)

export default router;