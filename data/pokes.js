import {pokes} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';
import * as validation from '../utils/validation.js';

const pokeUser = async (pokerId, userId) => {
  helpers.checkId(pokerId)
  helpers.checkId(userId)
  
  const pokesCollection = await pokes()

  await pokesCollection.insertOne({
    pokerId,
    userId,
    acknowledged: false,
  })
}

const getPokes = async (userId) => {
  helpers.checkId(userId)

  const pokesCollection = await pokes()

  const pokesList = await pokesCollection.find({
    userId,
    acknowledged: false,
  }).toArray()

  return pokesList
}

const acknowledgePoke = async (userId, pokedId) => {
  helpers.checkId(userId)
  helpers.checkId(pokedId)

  const pokesCollection = await pokes()

  await pokesCollection.findOneAndUpdate({
    userId,
    acknowledged: false
  }, { $set: { acknowledged: true } })
}

export {
  pokeUser,
  getPokes,
  acknowledgePoke,
}