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
    password
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
        region: "", // default region
        preferredRoles: [], // default preferred roles
        rank: "",
        reputation: 0,
        friends: [], // default friends list
    };

    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo) throw 'Could not add user';

    return { registrationCompleted: true }; // not sure what we want atm
}

const loginUser = async (username, password) => {
    // 2-20 characters again maybe
    username = helpers.checkString(username);

    // no spaces, atleast 1 capital, numbers, special characters
    helpers.checkString(password);

    // check database if this username exists
    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ username: username });
    if (!existingUser) throw 'Either the username or password is invalid';   

    // check if password is correct
    let comparePassword;
    try {
      comparePassword = await bcrypt.compare(password, existingUser.password);
    } catch (e) {
        throw 'Server error occured';
    }

    if (!comparePassword) {
      throw 'Either the userId or password is invalid';
    }

    // user info to store in session, not sure what we would like.
    let userInfo ={
        username: existingUser.username,
        email: existingUser.email,
        profilePicture: existingUser.profilePicture,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        biography: existingUser.biography,
        riotId: existingUser.riotId,
        region: existingUser.region,
        preferredRoles: existingUser.preferredRoles,
        rank: existingUser.rank,
        reputation: existingUser.reputation,
        friends: existingUser.friends
    }

    return userInfo; 
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
    loginUser,
    deleteUser
}