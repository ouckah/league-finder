import {teams} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';
import * as validation from '../utils/validation.js';
import Fuse from 'fuse.js';

const removeAllInstancesOfUserFromTeam = (team, userId) => {
    team.members = team.members.filter(member => member != userId);
    team.requests = team.requests.filter(request => request != userId);
    team.messages = team.messages.filter(message => message.userId != userId);
    if(team.members.length === 0){
	return null;
    }
    if(team.owner === userId){
	team.owner = team.members[0];
    }
}

const cascadeUserDeletionToTeams = async (userId) => {
    let allTeams = await getAllTeams();
    const teamsCollection = await teams();

    for (const team of allTeams){
	if(team.members.includes(userId) || team.requests.includes(userId)){
	    const status = removeAllInstancesOfUserFromTeam(team, userId);

	    if(status === null){
		await deleteTeam(team._id);
		return;
	    }

	    const id = team._id;
	    delete team._id;

	    await teamsCollection.updateOne(
		{ _id: new ObjectId(id) },
		{ $set: team}
	    );
	}
    }


}

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
	messages: []
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
    userId = helpers.checkId(userId);

    let team = await getTeam(teamId);

    if (!team) {
	throw 'Team not found';
    }

    if (userId === team.owner) {
	throw 'Owner cannot be removed from team';
    }

    const teamsCollection = await teams();

    team.members = team.members.filter(member => member != userId);

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

    team.requests = team.requests.filter(request => request != userId);
    team.members.push(userId);

    await teamsCollection.updateOne(
	{ _id: new ObjectId(teamId) },
	{ $set: team }
    );

    return teamId;
}

const deleteTeam = async (teamId) => {
    teamId = helpers.checkId(teamId);

    const teamsCollection = await teams();
    const team = await teamsCollection.findOne({ _id: new ObjectId(teamId) });
    if (!team){
	throw 'Team not found';
    }

    await teamsCollection.deleteOne({ _id: new ObjectId(teamId) });

    return teamId;
}

const addMessage = async (teamId, userId, message) => {
    teamId = helpers.checkId(teamId);
    message = helpers.checkString(message, 'message');
    if (!message) {
	throw 'Message cannot be empty';
    }

    const teamsCollection = await teams();
    const team = await teamsCollection.findOne({ _id: new ObjectId(teamId) });
    if (!team){
	throw 'Team not found';
    }

    const messageId = new ObjectId();
    let date = new Date();
    date = date.toDateString()

    const messageObj = {
	messageId: messageId,
	userId: userId,
	message: message,
	time: date 
    }

    team.messages.push(messageObj);

    await teamsCollection.updateOne(
	{ _id: new ObjectId(teamId) },
	{ $set: team }
    );

    return teamId;
}

const searchTeams = async (search) => {
    const options = {
	includeScore: true,
	keys: ['title', 'description']
    }

    const allTeams = await getAllTeams();

    const searchTerm = search;
    const fuse = new Fuse(allTeams, options)
    const searchResult = fuse.search(searchTerm);
    const filteredResult = searchResult.filter(result => result.score < 0.5);
    return filteredResult.map(result => result.item);
}

export { createTeam, getTeam, getAllTeams, removeUserFromTeam, requestToJoinTeam, acceptTeamJoinRequest, deleteTeam, cascadeUserDeletionToTeams, addMessage, searchTeams};

