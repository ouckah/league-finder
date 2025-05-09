import {teams} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';
import * as validation from '../utils/validation.js';

const createTeam = async (title, desiredRank, desiredRole, region, description, owner) => {
    validation.validateTeam(title, desiredRank, desiredRole, region, description);

    title = title.trim();
    desiredRank = desiredRank.map(rank => rank.trim());
    desiredRole = desiredRole.map(role => role.trim());
    region = region.trim();
    description = description.trim();

    const team = {
	title: title,
	desiredRank: desiredRank,
	desiredRole: desiredRole,
	region: region,
	description: description,
	owner: owner,
	members: [owner],
	requests: [],
    };

    const teamsCollection = await teams();
    const newTeam = await teamsCollection.insertOne(team);

    return newTeam.insertedId.toString();
}

const getTeam = async (id) => {
    id = helpers.checkId(id);

    const teamsCollection = await teams();
    const team = await teamsCollection.findOne({ _id: new ObjectId(id) });
    if (!team){
	throw 'Team not found';
    }

    return team;
}

const getAllTeams = async () => {
    const teamsCollection = await teams();
    let allTeams = await teamsCollection.find({}).toArray();
    allTeams = allTeams.map(team => {
	team._id = team._id.toString();
	return team;
    });

    return allTeams;
}

const removeUserFromTeam = async (teamId, userId) => {
    userId = helpers.checkId(teamId);

    let team = await getTeam(teamId);

    if (!team) {
	throw 'Team not found';
    }

    if (userId === team.owner) {
	throw 'Owner cannot be removed from team';
    }

    const teamsCollection = await teams();

    team.members = team.members.filter(member => member !== userId);

    await teamsCollection.updateOne(
	{ _id: new ObjectId(teamId) },
	{ $set: team }
    );
  
    return teamId;
}

const requestToJoinTeam = async (teamId, userId) => {
    userId = helpers.checkId(userId);

    let team = await getTeam(teamId);

    if (!team) {
	throw 'Team not found';
    }

    const teamsCollection = await teams();

    if (team.requests.includes(userId)) {
	throw 'User already requested to join this team';
    }

    team.requests.push(userId);

    await teamsCollection.updateOne(
	{ _id: new ObjectId(teamId) },
	{ $set: team }
    );

    return teamId;
}

const acceptTeamJoinRequest = async (teamId, userId) => {
    userId = helpers.checkId(userId);

    let team = await getTeam(teamId);

    if (!team) {
	throw 'Team not found';
    }

    const teamsCollection = await teams();

    if (team.members.includes(userId)) {
	throw 'User already in team';
    }

    team.request = team.request.filter(request => request !== userId);
    team.members.push(userId);

    await teamsCollection.updateOne(
	{ _id: new ObjectId(teamId) },
	{ $set: team }
    );

    return teamId;
}

export { createTeam, getTeam, getAllTeams, removeUserFromTeam, requestToJoinTeam, acceptTeamJoinRequest};

