import { users } from '../config/mongoCollections.js';
import { MongoNetworkTimeoutError, ObjectId } from 'mongodb';
import helpers from '../utils/helpers.js';
import * as validation from '../utils/validation.js';
import bcrypt from 'bcrypt';
import * as riotAPI from './api.js';

// not sure if we want to try to fill in all fields or let useres fill fields on profile page
const createUser = async (
    firstName,
    lastName,
    email,
    username,
    password
) => {
    // validate input
    validation.validateRegistration(
        firstName,
        lastName,
        email,
        username,
        password,
        password // confirmPassword is same for this. weird system but works for now
    )

    // check database if this username exists... then throw
    const usersCollection = await users();
    const existingUser = await usersCollection.findOne({ username: username });
    if (existingUser) throw 'User with that username already exists';

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

    return insertInfo.insertedId.toString();
}

const loginUser = async (username, password) => {
    // 2-20 characters again maybe
    username = helpers.checkString(username);
    helpers.checkStringWithLength(username, 2, 20, /^[a-zA-Z0-9]+$/);

    // no spaces, atleast 1 capital, numbers, special characters
    helpers.checkString(password);

    if (password.length < 8) {
        throw 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
        throw 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
        throw 'Password must contain at least one number';
    }
    if (!/[^a-zA-Z0-9 ]/.test(password)) {
        throw 'Password must contain at least one special character';
    }

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
    let userInfo = {
        // store userId in session for use in other functions, converted to string
        userId: existingUser._id.toString(),
        myFavoriteBrainrot: "Cappucino Cappucino Assasino"
    }

    return userInfo;
}

// maybe we can break this into multiple functions, one for each field?
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

const deleteUser = async (userId) => {
    // Check id and delete user from database
    userId = helpers.checkId(userId, 'userId');

    const usersCollection = await users();
    const deletionInfo = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    if (deletionInfo.deletedCount === 0) throw 'Could not delete user';
    return { deletionCompleted: true };
}

const getUser = async (userId) => {
    userId = helpers.checkId(userId, 'userId');

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) throw 'User not found';
    return user;
}

// might not need this, but maybe when searching for users by username
const getUserByUsername = async (username) => {
    if (!username) throw 'You must provide a username';
    if (typeof username !== 'string') throw 'username must be a string';
    if (username.length < 2 || username.length > 20) throw 'username must be between 2 and 20 characters long';
    if (!/^[a-zA-Z0-9]+$/.test(username)) throw 'username can only contain letters and numbers';

    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });
    if (!user) throw 'User not found';
    return user;
}

// sets ranked data to the user given their riotId
const getRankData = async (userId) => {
    userId = helpers.checkId(userId, 'userId');
    try {
        const user = await getUser(userId);
        const puuid = await riotAPI.getPuuid(user.riotId);
        const rank = await riotAPI.getRank(puuid, user.region);
        let updateUser = {};
        if (rank.rank === '') {
            updateUser = {
                rank: `Rank: ${rank.tier} - ${rank.lp}`
            };
        } else {
            updateUser = {
                rank: `Rank: ${rank.tier} ${rank.rank} - ${rank.lp}`
            };
        }
        await userCollection.updateOne(
            { _id: ObjectId(userId) },
            { $set: updateUser }
        );
        return { rankUpdated: true };
    } catch (e) {
        throw e;
    }
};

export {
    createUser,
    editUser,
    loginUser,
    deleteUser,
    getUser,
    getRankData
}
