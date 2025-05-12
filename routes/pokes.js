import { Router } from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import { protectedRoute } from '../utils/middleware.js';
import * as pokesData from '../data/pokes.js';

const getPokesHandler = async (req, res) => {
  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    const pokesList = await pokesData.getPokes(owner)
    return res.status(200).json({ pokes: pokesList })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}

const getPokeStatusHandler = async (req, res) => {
  const { userId } = req.params

  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
    helpers.checkId(userId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    const status = await pokesData.getPokeStatus(owner, userId)
    return res.status(200).json({ success: true, status })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}

const acknowledgePokeHandler = async (req, res) => {
  const { userId } = req.params

  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
    helpers.checkId(userId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    await pokesData.acknowledgePoke(owner, userId)
    return res.status(200).json({ success: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}

const pokeUserHandler = async (req, res) => {
  const { userId } = req.params

  try {
    helpers.checkId(req.session.user.userId.toString(), "id")
    helpers.checkId(userId, "id")
  } catch (e) {
    return res.status(400).json({ error: e.message })
  }

  try {
    const owner = req.session.user.userId
    await pokesData.pokeUser(owner, userId)
    return res.status(200).json({ success: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message })
  }
}

router
  .route('/')
  .all(protectedRoute)
  .get(getPokesHandler)

router
  .route('/:userId')
  .all(protectedRoute)
  .get(getPokeStatusHandler)
  .post(pokeUserHandler)

router
  .route('/acknowledge/:userId')
  .all(protectedRoute)
  .patch(acknowledgePokeHandler)

export default router;