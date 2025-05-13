import { users } from '../config/mongoCollections.js';
import { MongoNetworkTimeoutError, ObjectId } from 'mongodb';
import helpers from '../utils/helpers.js';
import * as validation from '../utils/validation.js';
import bcrypt from 'bcrypt';
import * as riotAPI from './api.js';
import { cascadeUserDeletionToTeams } from './teams.js';
import { clearFriendRequests, clearFriends } from './friends.js';
import { clearPokes } from './pokes.js';

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
    const existingUser = await usersCollection.findOne({ username: username.toLowerCase() });
    if (existingUser) throw 'User with that username already exists';

    // hash password
    const saltRounds = 16;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let newUser = {
        username: username.toLowerCase(),
        email: email,
        password: hashedPassword,
        profilePicture: "https://cdn.discordapp.com/attachments/1338571359940382811/1371512930855555122/IMG_8009.jpg?ex=6824b9f4&is=68236874&hm=03fb58d812df4263de9349217398b23d303bb049c5c6e00b6739c60989238476&format=webp", // default profile picture
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
    const existingUser = await usersCollection.findOne({ username: username.toLowerCase() });
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

    let userInfo = {
        // store userId in session for use in other functions, converted to string
        userId: existingUser._id.toString(),
        myFavoriteBrainrot: "Cappucino Cappucino Assasino"
    }

    return userInfo;
}

const editUser = async (
    userId,
    username,
    email,
    biography,
    riotId,
    region,
    preferredRoles,
    profilePicture
) => {
    if (preferredRoles && preferredRoles.length > 0) {
        preferredRoles = preferredRoles.map(role => role.trim());
    } else {
        preferredRoles = [''];
    }
    validation.validateEdit(username, email, biography, riotId, region, preferredRoles, profilePicture);
    try {
        const userCollection = await users();
        const user = await getUser(userId);
        if (user.username !== username.toLowerCase()) {
            const existingUser = await userCollection.findOne({ username: username.toLowerCase() });
            if (existingUser) throw 'User with that username already exists';
        }
        const updateUser = {
            username: username.toLowerCase(),
            email: email,
            biography: biography,
            riotId: riotId,
            region: region,
            preferredRoles: preferredRoles,
            profilePicture: profilePicture
        };
        const updateInfo = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateUser }
        );
        let updateRank;
        if (riotId.length > 0) {
            const changeRank = await getRankData(userId);
        } else {
            updateRank = {
                rank: 'No rank data found.'
            }
            const update2 = await userCollection.updateOne(
                { _id: new ObjectId(userId) },
                { $set: updateRank }
            )
        }
        return { userUpdated: true };
    } catch (e) {
        throw e;
    }
}

const deleteUser = async (userId) => {
    // Check id and delete user from database
    userId = helpers.checkId(userId, 'userId');

    const usersCollection = await users();
    const deletionInfo = await usersCollection.deleteOne({ _id: new ObjectId(userId) });
    if (deletionInfo.deletedCount === 0) throw 'Could not delete user';
    cascadeUserDeletionToTeams(userId);
    clearFriendRequests(userId);
    clearFriends(userId);
    clearPokes(userId);
    return { deletionCompleted: true };
}

const getUser = async (userId) => {
    userId = helpers.checkId(userId, 'userId');

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) throw 'User not found';
    return user;
}


const getUserByUsername = async (username) => {
    if (!username) throw 'You must provide a username';
    if (typeof username !== 'string') throw 'username must be a string';
    if (username.length < 2 || username.length > 20) throw 'username must be between 2 and 20 characters long';
    if (!/^[a-zA-Z0-9]+$/.test(username)) throw 'username can only contain letters and numbers';

    const userCollection = await users();
    const user = await userCollection.findOne({ username: username.toLowerCase() });
    if (!user) throw 'User not found';
    return user;
}

// sets ranked data to the user given their riotId
const getRankData = async (userId) => {
    userId = helpers.checkId(userId, 'userId');
    try {
        const user = await getUser(userId);
        let riotName = user.riotId.split('#');
        const puuid = await riotAPI.getPuuid(riotName[0], riotName[1], user.region);
        const rank = await riotAPI.getRank(puuid, user.region);
        let updateUser = {};
        if (rank.rank === '' && rank.tier.length > 0) {
            updateUser = {
                rank: `${rank.tier} - ${rank.lp}`
            };
        } else if (rank.rank.length > 0) {
            updateUser = {
                rank: `${rank.tier} ${rank.rank} - ${rank.lp}`
            };
        } else {
            updateUser = {
                rank: 'No rank data found.'
            }
        }
        const userCollection = await users();
        const updateInfo = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: updateUser }
        );
        return { rankUpdated: true };
    } catch (e) {
        throw e;
    }
};

const getWR = async (userId) => {
    userId = helpers.checkId(userId, 'userId');
    try {
        const user = await getUser(userId);
        let riotName = user.riotId.split('#');
        const puuid = await riotAPI.getPuuid(riotName[0], riotName[1], user.region);
        const wr = await riotAPI.getWinLoss(puuid, user.region);
        return `${wr.wr}% (${wr.wins} W/${wr.losses} L)`;
    } catch (e) {
        throw e;
    }
}

const getMatches = async (userId) => {
    userId = helpers.checkId(userId, 'userId');
    try {
        const user = await getUser(userId);
        let riotName = user.riotId.split('#');
        const puuid = await riotAPI.getPuuid(riotName[0], riotName[1], user.region);
        const matches = await riotAPI.getRecentMatches(puuid, 5, user.region);
        return matches;
    } catch (e) {
        throw e;
    }
}

export {
    createUser,
    editUser,
    loginUser,
    deleteUser,
    getUser,
    getRankData,
    getWR,
    getMatches,
    getUserByUsername
}
