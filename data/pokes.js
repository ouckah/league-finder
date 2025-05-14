import {pokes, users} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';

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
  helpers.checkId(userId);

  const pokesCollection = await pokes();
  const usersCollection = await users();

  const pokesList = await pokesCollection.find({
    userId,
    acknowledged: false,
  }).toArray();

  const populatedPokesList = await Promise.all(
    pokesList.map(async (poke) => {
      const sender = await usersCollection.findOne({ _id: new ObjectId(poke.pokerId) });

      return {
        ...poke,
        senderUser: sender
          ? {
              _id: sender._id,
              username: sender.username,
              profilePicture: sender.profilePicture,
              riotId: sender.riotId,
              region: sender.region,
              rank: sender.rank,
            }
          : null,
      };
    })
  );

  return populatedPokesList;
};

const getPokeStatus = async (pokerId, userId) => {
  helpers.checkId(pokerId)
  helpers.checkId(userId)
  
  const pokesCollection = await pokes()

  const poke = await pokesCollection.findOne({
    pokerId,
    userId,
  })

  if (!poke) return null

  return poke.acknowledged
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

const clearPokes = async (userId) => {
  helpers.checkId(userId)

  const pokesCollection = await pokes()

  await pokesCollection.deleteMany({
    $or: [
      { userId: userId },
      { pokerId: userId }
    ]
  })
}

export {
  pokeUser,
  getPokes,
  getPokeStatus,
  acknowledgePoke,
  clearPokes,
}