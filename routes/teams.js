import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import * as validation from '../utils/validation.js';
import * as teamData from '../data/teams.js';

router.route('/new')
    .get((req, res) => {
	res.render('teams/newteam');
    })

router.route('/')
    .post(async (req, res) => {
	const title = req.body.title;
	const owner = req.session.user.userId;

	let desiredRank = req.body.desiredRank;
	let desiredRole = req.body.desiredRole;

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
	return res.render('teams/teams', {teams: allTeams});
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

	res.render('teams/team', {team:team});
    })







export default router;
