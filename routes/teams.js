import { Router } from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import { protectedRoute } from '../utils/middleware.js';
import * as validation from '../utils/validation.js';
import * as teamData from '../data/teams.js';
import * as userData from '../data/users.js';

router.route('/new')
    .all(protectedRoute)
    .get((req, res) => {
	res.render('teams/newteam', { title: "Create Team" });
    })

router.route('/')
    .post(async (req, res) => {
	if(!req.session.user) {
	    return res.status(401).json({ error: 'You must be logged in to create a team' });
	}

	const owner = req.session.user.userId;
	if(!req.body.title) {
	    return res.status(400).json({ error: 'Title is required' });
	}
	const title = req.body.title;

	let desiredRank = []
	if(req.body.desiredRank) {
	    desiredRank = req.body.desiredRank;
	}

	let desiredRole = [];
	if (req.body.desiredRole) {
	    desiredRole = req.body.desiredRole;
	}

	if(!req.body.region) {
	    return res.status(400).json({ error: 'Region is required' });
	}
	const region = req.body.region;

	if(!req.body.description) {
	    return res.status(400).json({ error: 'Description is required' });
	}
	const description = req.body.description;

	try {
	    validation.validateTeam(
		title,
		desiredRank,
		desiredRole,
		region,
		description
	    );
	} catch (e) {
	    return res.status(400).json({ error: e.message });
	}

	desiredRank = desiredRank.map(rank => rank.trim());
	desiredRole = desiredRole.map(role => role.trim());

	const id = await teamData.createTeam(
	    title,
	    desiredRank,
	    desiredRole,
	    region,
	    description,
	    owner
	);

	return res.status(200).json({ id: id });
    })
    .get(async (req, res) => {
	let returnedTeams = [];

	if (req.query.teamsSearch) {
	    returnedTeams = await teamData.searchTeams(req.query.teamsSearch);
	} else {
	    returnedTeams = await teamData.getAllTeams();
	}

	const loggedIn = req.session.user != undefined;
	return res.render('teams/teams', { teams: returnedTeams, loggedIn: loggedIn, title: "Teams" });
    })

router.route('/:id')
    .get(async (req, res) => {
	const teamId = req.params.id;
	try {
	    helpers.checkId(teamId);
	} catch (e) {
	    return res.status(400).render('error', { error: e.message, title: 'Error' });
	}

	const team = await teamData.getTeam(teamId);
	if (!team) {
	    res.status(404).render('error', { error: 'Team not found', title: 'Error' });
	    return;
	}

	let joinable = false;
	let leavable = false;
	let isowner = false;
	let ismember = false;
	let requested = false;

	if (req.session.user) {
	    const user = req.session.user.userId;
	    joinable = !team.requests.includes(user) && !team.members.includes(user);
	    leavable = team.owner !== user && team.members.includes(user);
	    isowner = team.owner === user;
	    ismember = team.members.includes(user);
	    requested = team.requests.includes(user);
	}
	const ownerData = await userData.getUser(team.owner);
	const owner = {username: ownerData.username, id: ownerData._id};

	const memberIds = team.members;
	let members = [];
	for (let i = 0; i < memberIds.length; i++) {
	    const member = await userData.getUser(memberIds[i]);
	    members.push(member);
	}
	members = members.map(member => ({username: member.username, id: member._id}));

	let requests = [];
	const requestIds = team.requests;
	for (let i = 0; i < requestIds.length; i++) {
	    const request = await userData.getUser(team.requests[i]);
	    requests.push(request);
	}
	requests = requests.map(request => request.username);

	let messages = [];
	for (const message of team.messages) {
	    let username = (await userData.getUser(message.userId)).username;
	    messages.push(`${username} [${message.time}]: ${message.message}`);
	}

	res.render('teams/team', { team: team, joinable: joinable, leavable: leavable, members: members, isowner: isowner, owner: owner, messages: messages, ismember: ismember, title: team.title, requested:requested});
    })

router.route('/:id/leave').all(protectedRoute)
    .get(async (req, res) => {
	const teamId = req.params.id;
	try {
	    helpers.checkId(teamId);
	} catch (e) {
	    return res.status(400).render('error', { error: e.message, title: 'Error' });
	}

	const team = await teamData.getTeam(teamId);
	if (!team) {
	    res.status(404).render('error', { error: 'Team not found', title: 'Error' });
	    return;
	}

	if (!req.session.user) {
	    res.status(401).render('error', { error: 'You must be logged in to leave a team', title: 'Error' });
	    return;
	}

	const user = req.session.user.userId;

	if (user === team.owner) {
	    res.status(400).render('error', { error: 'You cannot leave your own team', title: 'Error' });
	    return;
	}

	if (!team.members.includes(user)) {
	    res.status(400).render('error', { error: 'You are not a member of this team', title: 'Error' });
	    return;
	}

	try {
	    await teamData.removeUserFromTeam(teamId, user);
	} catch (e) {
	    res.status(400).render('error', { error: e.message, title: 'Error' });
	}

	res.redirect(`/teams/${teamId}`);
    })

router.route('/:id/join').all(protectedRoute).get(async (req, res) => {
    const teamId = req.params.id;
    try {
	helpers.checkId(teamId);
    } catch (e) {
	return res.status(400).render('error', { error: e.message, title: 'Error' });
    }

    const team = await teamData.getTeam(teamId);
    if (!team) {
	res.status(404).render('error', { error: 'Team not found', title: 'Error' });
	return;
    }

    if (!req.session.user) {
	res.status(401).render('error', { error: 'You must be logged in to join a team', title: 'Error' });
    }
    const user = req.session.user.userId;

    if (user === team.owner) {
	res.status(400).render('error', { error: 'You cannot join your own team', title: 'Error' });
	return;
    }

    if (team.requests.includes(user)) {
	res.status(400).render('error', { error: 'You have already requested to join this team', title: 'Error' });
	return;
    }

    try {
	await teamData.requestToJoinTeam(teamId, user);
    } catch (e) {
	res.status(400).render('error', { error: e.message, title: 'Error' });
    }

    res.redirect(`/teams/${teamId}`);
})

router.route('/:id/accept').all(protectedRoute).patch(async (req, res) => {
    const teamId = req.params.id;
    if (!req.body.requests) {
	return res.status(400).render('error', { error: 'userId is required', title: 'Error' });
    }
    const userId = req.body.requests;

    try {
	helpers.checkId(teamId);
	helpers.checkId(userId);
    } catch (e) {
	return res.status(400).json({ error: e.message });
    }

    const team = await teamData.getTeam(teamId);
    if (!team) {
	res.status(404).json({ error: 'Team not found' });
	return;
    }

    if (!req.session.user) {
	res.status(401).json({ error: 'You must be logged in to accept a request' });
    }
    const principal = req.session.user.userId;

    if (principal != team.owner) {
	res.status(403).json({ error: 'You are not the owner of this team' });
	return;
    }

    if (team.members.includes(userId)) {
	res.status(400).json({ error: 'This user is already a member of this team' });
	return;
    }

    try {
	await teamData.acceptTeamJoinRequest(teamId, userId);
    } catch (e) {
	res.status(400).json({ error: e.message });
	return;
    }
    return res.status(200).json({ teamId: teamId });

})

router.route('/:id/kick').all(protectedRoute).patch(async (req, res) => {
    const teamId = req.params.id;
    if (!req.body.members) {
	return res.status(400).json({ error: 'userId is required' });
    }
    const userId = req.body.members;

    try {
	helpers.checkId(teamId);
	helpers.checkId(userId);
    } catch (e) {
	return res.status(400).json({ error: e.message });
    }

    const team = await teamData.getTeam(teamId);
    if (!team) {
	res.status(404).json({ error: 'Team not found' });
	return;
    }

    if (!req.session.user) {
	res.status(401).json({ error: 'You must be logged in to kick a user' });
    }
    const principal = req.session.user.userId;

    if (principal != team.owner) {
	res.status(403).json({ error: 'You are not the owner of this team' });
	return;
    }

    if (!team.members.includes(userId)) {
	res.status(400).json({ error: 'This user is not a member of this team' });
	return;
    }

    if (userId === team.owner) {
	res.status(400).json({ error: 'You cannot kick the owner of this team' });
	return
    }

    try {
	await teamData.removeUserFromTeam(teamId, userId);
    } catch (e) {
	res.status(400).json({ error: e.message });
	return
    }
    return res.status(200).json({ teamId: teamId });
})

router.route('/:id/admin').all(protectedRoute).get(async (req, res) => {
    const teamId = req.params.id;
    try {
	helpers.checkId(teamId);
    } catch (e) {
	return res.status(400).render('error', { error: e.message, title: 'Error' });
    }

    const team = await teamData.getTeam(teamId);
    if (!team) {
	res.status(404).render('error', { error: 'Team not found', title: 'Error' });
	return;
    }

    if (!req.session.user) {
	res.status(401).render('error', { error: 'You must be logged in to view this page', title: 'Error' });
	return;
    }

    const user = req.session.user.userId;

    if (user != team.owner) {
	res.status(403).render('error', { error: 'You are not the owner of this team', title: 'Error' });
	return;
    }

    const memberIds = team.members;
    let members = [];
    for (let i = 0; i < memberIds.length; i++) {
	const member = await userData.getUser(memberIds[i]);
	members.push(member);
    }
    members = members.filter(member => member._id != team.owner);
    members = members.map(member => ({ username: member.username, id: member._id }));

    const requestIds = team.requests;
    let requests = [];
    for (let i = 0; i < requestIds.length; i++) {
	const request = await userData.getUser(requestIds[i]);
	requests.push(request);
    }
    requests = requests.map(request => ({ username: request.username, id: request._id }));

    res.render('teams/admin', { team: team, members: members, requests: requests, title: 'Team Admin Page' });
})

router.route('/:id/chat').all(protectedRoute).post(async (req, res) => {
    const teamId = req.params.id;
    const message = req.body.teamsmessage;

    if (!message) {
	return res.status(400).json({ error: 'Message is required', title: 'Error' });
    }

    try {
	helpers.checkId(teamId);
    } catch (e) {
	return res.status(400).json({ error: e.message, title: 'Error' });
    }

    const team = await teamData.getTeam(teamId);
    if (!team) {
	res.status(404).json({ error: 'Team not found', title: 'Error' });
	return;
    }

    if (!req.session.user) {
	res.status(401).json({ error: 'You must be logged in to send a message', title: 'Error' });
	return;
    }

    const userId = req.session.user.userId;

    if (!team.members.includes(userId)) {
	res.status(403).json({ error: 'You are not a member of this team', title: 'Error' });
	return;
    }

    try {
	await teamData.addMessage(teamId, userId, message);
    } catch (e) {
	res.status(400).json({ error: e.message, title: 'Error' });
	return;
    }
    return res.status(200).json({ teamId: teamId });
})


export default router;
