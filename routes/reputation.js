import { Router } from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import { protectedRoute } from '../utils/middleware.js';
import * as reputationData from '../data/reputation.js';

const upvoteUserHandler = async (req, res) => {
  const { userId } = req.params

  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
    helpers.checkId(userId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    const change = await reputationData.upvote(owner, userId)
    return res.status(200).json({ success: true, change })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}

const downvoteUserHandler = async (req, res) => {
  const { userId } = req.params

  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
    helpers.checkId(userId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    const change = await reputationData.downvote(owner, userId)
    return res.status(200).json({ success: true, change })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}

const getVoteStatus = async (req, res) => {
  const { userId } = req.params

  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
    helpers.checkId(userId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    const status = await reputationData.getStatus(owner, userId)
    return res.status(200).json({ success: true, status })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}

router
  .route('/upvote/:userId')
  .all(protectedRoute)
  .patch(upvoteUserHandler)

router
  .route('/downvote/:userId')
  .all(protectedRoute)
  .patch(downvoteUserHandler)

router
  .route('/vote/:userId')
  .all(protectedRoute)
  .get(getVoteStatus)

export default router;