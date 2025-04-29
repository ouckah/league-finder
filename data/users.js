import {users} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';


const createUser = async (
    email,
    username,
    password,
    firstName,
    lastName
  ) => {
}

const editUser = async (
    email,
    username,
    password,
    profilePicture,
    firstName,
    lastName,
    biography,
    riotId,
    region,
    preferredRoles
) => {
}

const deleteUser = async (
    userId
) => {
}

export default {
    createUser,
    editUser,
    deleteUser
}