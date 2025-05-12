import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import { protectedRoute} from '../utils/middleware.js';
import * as validation from '../utils/validation.js';
import * as teamData from '../data/teams.js';
import * as userData from '../data/users.js';

router.route('/new')
    .all(protectedRoute)
    .get((req, res) => {
	res.render('teams/newteam');
    })

router.route('/')
    .post(async (req, res) => {
	const title = req.body.title;
	const owner = req.session.user.userId;

	let desiredRank = req.body.desiredRank;
	if(!desiredRank) {
	    desiredRank = [];
	}
	let desiredRole = req.body.desiredRole;
	if(!desiredRole) {
	    desiredRole = [];
	}

	const region = req.body.region;
	const description = req.body.description;

	validation.validateTeam(
	    title,
	    desiredRank,
	    desiredRole,
	    region,
	    description
	);

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

	res.redirect(`/teams/${id}`);
    })
    .get(async (req, res) => {
	const allTeams = await teamData.getAllTeams();
	const loggedIn = req.session.user != undefined;
	return res.render('teams/teams', {teams: allTeams, loggedIn: loggedIn});
    })

router.route('/:id')
    .get(async (req, res) => {
	const teamId = req.params.id;
	try {
	    helpers.checkId(teamId);
	} catch (e) {
	    return res.status(400).render('error', {error: e.message});
	}

	const team = await teamData.getTeam(teamId);
	if (!team) {
	    res.status(404).render('error', {error: 'Team not found'});
	    return;
	}

	let joinable = false;
	let leavable = false;
	let isowner = false;
	if (req.session.user) {
	    const user = req.session.user.userId;
	    joinable = !team.requests.includes(user) && !team.members.includes(user);
	    leavable = team.owner !== user && team.members.includes(user);
	    isowner = team.owner === user;
	}
	const owner = (await userData.getUser(team.owner)).username;

	const memberIds = team.members;
	let members = [];
	for (let i = 0; i < memberIds.length; i++) {
	    const member = await userData.getUser(memberIds[i]);
	    members.push(member);
	}
	members = members.map(member => member.username);
	
	let requests = [];
	const requestIds = team.requests;
	for (let i = 0; i < requestIds.length; i++) {
	    const request = await userData.getUser(team.requests[i]);
	    requests.push(request);
	}
	requests = requests.map(request => request.username);

	res.render('teams/team', {team:team, joinable:joinable, leavable:leavable, members:members, isowner:isowner, owner:owner});
    })

router.route('/:id/leave')
    .get(async (req, res) => {
	const teamId = req.params.id;
	try {
	    helpers.checkId(teamId);
	} catch (e) {
	    return res.status(400).render('error', {error: e.message});
	}

	const team = await teamData.getTeam(teamId);
	if (!team) {
	    res.status(404).render('error', {error: 'Team not found'});
	    return;
	}

	if (!req.session.user) {
	    res.status(401).render('error', {error: 'You must be logged in to leave a team'});
	    return;
	}

	const user = req.session.user.userId;

	if (user === team.owner) {
	    res.status(400).render('error', {error: 'You cannot leave your own team'});
	    return;
	}

	if (!team.members.includes(user)) {
	    res.status(400).render('error', {error: 'You are not a member of this team'});
	    return;
	}

	try {
	    await teamData.removeUserFromTeam(teamId, user);
	} catch (e) {
	    res.status(400).render('error', {error: e.message});
	}

	res.redirect(`/teams/${teamId}`);
    })

router.route('/:id/join') .get(async (req, res) => {
    const teamId = req.params.id;
    try {
	helpers.checkId(teamId);
    } catch (e) {
	return res.status(400).render('error', {error: e.message});
    }

    const team = await teamData.getTeam(teamId);
    if (!team) {
	res.status(404).render('error', {error: 'Team not found'});
	return;
    }

    if (!req.session.user) {
	res.status(401).render('error', {error: 'You must be logged in to join a team'});
    }
    const user = req.session.user.userId;

    if (user === team.owner) {
	res.status(400).render('error', {error: 'You cannot join your own team'});
	return;
    }

    if (team.requests.includes(user)) {
	res.status(400).render('error', {error: 'You have already requested to join this team'});
	return;
    }

    try { await teamData.requestToJoinTeam(teamId, user);
    } catch (e) {
	res.status(400).render('error', {error: e.message});
    }

    res.redirect(`/teams/${teamId}`);
})

router.route('/:id/accept').post(async (req, res) => {
    const teamId = req.params.id;
    if(!req.body.requests) {
	return res.status(400).render('error', {error: 'userId is required'});
    }
    const userId = req.body.requests;

    try {
	helpers.checkId(teamId);
	helpers.checkId(userId);
    } catch (e) {
	return res.status(400).render('error', {error: e.message});
    }

    const team = await teamData.getTeam(teamId);
    if (!team) {
	res.status(404).render('error', {error: 'Team not found'});
	return;
    }

    if (!req.session.user) {
	res.status(401).render('error', {error: 'You must be logged in to accept a request'});
    }
    const principal = req.session.user.userId;

    if (principal!= team.owner) {
	res.status(403).render('error', {error: 'You are not the owner of this team'});
	return;
    }

    if (team.members.includes(userId)) {
	res.status(400).render('error', {error: 'This user is already a member of this team'});
	return;
    }

    try { await teamData.acceptTeamJoinRequest(teamId, userId);
    } catch (e) {
	res.status(400).render('error', {error: e.message});
    }

    res.redirect(`/teams/${teamId}`);
})

router.route('/:id/kick').post(async (req, res) => {
    const teamId = req.params.id;
    if(!req.body.members) {
	return res.status(400).render('error', {error: 'userId is required'});
    }
    const userId = req.body.members;

    try {
	helpers.checkId(teamId);
	helpers.checkId(userId);
    } catch (e) {
	return res.status(400).render('error', {error: e.message});
    }

    const team = await teamData.getTeam(teamId);
    if (!team) {
	res.status(404).render('error', {error: 'Team not found'});
	return;
    }

    if (!req.session.user) {
	res.status(401).render('error', {error: 'You must be logged in to kick a user'});
    }
    const principal = req.session.user.userId;

    if (principal != team.owner) {
	res.status(403).render('error', {error: 'You are not the owner of this team'});
	return;
    }

    if (!team.members.includes(userId)) {
	res.status(400).render('error', {error: 'This user is not a member of this team'});
	return;
    }

    if (userId === team.owner) {
	res.status(400).render('error', {error: 'You cannot kick the owner of this team'});
    }

    try { await teamData.removeUserFromTeam(teamId, userId);
    } catch (e) {
	res.status(400).render('error', {error: e.message});
    }

    res.redirect(`/teams/${teamId}`);
})

router.route('/:id/admin').get(async (req, res) => {
    const teamId = req.params.id;
    try {
	helpers.checkId(teamId);
    } catch (e) {
	return res.status(400).render('error', {error: e.message});
    }

    const team = await teamData.getTeam(teamId);
    if (!team) {
	res.status(404).render('error', {error: 'Team not found'});
	return;
    }

    if (!req.session.user) {
	res.status(401).render('error', {error: 'You must be logged in to view this page'});
	return;
    }

    const user = req.session.user.userId;

    if (user != team.owner) {
	res.status(403).render('error', {error: 'You are not the owner of this team'});
	return;
    }

    const memberIds = team.members;
    let members = [];
    for (let i = 0; i < memberIds.length; i++) {
	const member = await userData.getUser(memberIds[i]);
	members.push(member);
    }
    members = members.filter(member => member._id != team.owner);
    members = members.map(member => ({username: member.username, id: member._id}));

    const requestIds = team.requests;
    let requests = [];
    for (let i = 0; i < requestIds.length; i++) {
	const request = await userData.getUser(requestIds[i]);
	requests.push(request);
    }
    requests = requests.map(request => ({username: request.username, id: request._id}));

    res.render('teams/admin', {team:team, members:members, requests:requests});
})


export default router;
