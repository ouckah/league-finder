import {teams} from '../config/mongoCollections.js';
import {MongoNetworkTimeoutError, ObjectId} from 'mongodb';
import helpers from '../utils/helpers.js';
import * as validation from '../utils/validation.js';

const createTeam = async (title, desiredRank, desiredRole, region, description) => {
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
	description: description
    };

    const teamsCollection = await teams();
    const newTeam = await teamsCollection.insertOne(team);

    return newTeam.insertedId.toString();
}

const getTeam = async (id) => {
    helpers.checkId(id);
    id = id.trim();

    const teamsCollection = await teams();
    const team = await teamsCollection.findOne({ _id: new ObjectId(id) });
    if (!team) return null

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

export { createTeam, getTeam, getAllTeams};
