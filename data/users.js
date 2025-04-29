import {users} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';
import bcrypt from 'bcrypt';

// not sure if we want to try to fill in all fields or let useres fill fields on profile page
const createUser = async (
    firstName,
    lastName,
    email,
    username,
    password,
  ) => {
    // maybe like 2-20 characters for first and last name
    firstName = helpers.checkString(firstName);
    lastName = helpers.checkString(lastName);

    // email regex
    email = helpers.checkString(email);

    // 2-20 characters again maybe
    username = helpers.checkString(username);

    // check database if this username exists... then throw
    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ username: username });
    if (existingUser) throw 'User with that username already exists';    

    // no spaces, atleast 1 capital, numbers, special characters
    helpers.checkString(password);

    // hash password
    const saltRounds = 16;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = {
        username: username,
        email: email,
        password: hashedPassword,
        profilePicture: "", // default profile picture
        firstName: firstName,
        lastName: lastName,
        biography: "", // default biography
        riotId: "", // default riotId
        region: null, // default region
        preferredRoles: [], // default preferred roles
        rank: "",
        reputation: 0,
        friends: [], // default friends list
    };

    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo) throw 'Could not add user';

    return { registrationCompleted: true }; // not sure what we want atm
}

const findUser = async (username) => {
    userId = helpers.checkString(username, 'username');
    // has to be between certain length

    const usersCollection = await users();
    const user = await usersCollection.findOne({ username: username });
    if (!user) throw 'Could not find user';

    return user;
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