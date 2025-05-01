import {Router} from 'express';
const router = Router();
import helpers from '../utils/helpers.js';
import validation from '../public/util/validation.js';
import * as teamData from '../data/teams.js';

router.route('/new')
    .get((req, res) => {
	res.render('teams/newteam');
    })

router.route('/')
    .post(async (req, res) => {
	const title = req.body.title;

	let desiredRank = req.body.desiredRank;
	if(typeof desiredRank === 'string') {
	    desiredRank = [desiredRank];
	}

	let desiredRole = req.body.desiredRole;
	if(typeof desiredRole === 'string') {
	    desiredRole = [desiredRole];
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

	const result = await teamData.createTeam(
	    title,
	    desiredRank,
	    desiredRole,
	    region,
	    description
	);
	const id = result.insertedId.toString();

	res.redirect(`/teams/${id}`);
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
	console.log(team);

	res.render('teams/team', {team:team});
    })







export default router;
