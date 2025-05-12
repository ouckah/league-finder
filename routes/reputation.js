import { Router } from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import { protectedRoute } from '../utils/middleware.js';
import * as reputationData from '../data/reputation.js';

const upvoteUserHandler = async (req, res) => {
  const { userId } = req.param 

  try {
    helpers.checkId(userId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    await reputationData.upvote(userId)
    return res.status(200).json({ success: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}

const downvoteUserHandler = async (req, res) => {
  const { userId } = req.param 

  try {
    helpers.checkId(userId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    await reputationData.downvote(userId)
    return res.status(200).json({ success: true })
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

export default router;