import { createTeam } from '../data/teams.js';


const team1 = {
    title: 'Faker Team',
    desiredRank: ['gold', 'platinum'],
    desiredRole: ['top', 'mid'],
    region: 'NA',
    description: 'We are a team of players who want to reach the top of the ladder. We are looking for players who are willing to put in the time and effort to improve and climb the ranks.',
}

const team2 = {
    title: 'Pro Team',
    desiredRank: ['diamond', 'master'],
    desiredRole: ['adc', 'support'],
    region: 'EUW',
    description: 'Best team in EUW'
}

const team3 = {
    title: 'For fun',
    desiredRank: ['iron', 'bronze'],
    desiredRole: ['top', 'mid'],
    region: 'KR',
    description: 'We are a team of players who want to have fun and play together. We are looking for players who are willing to play for fun and enjoy the game.',
}

const teams = [
    team1,
    team2,
    team3
];

const seedTeams = async (userIds) => {
    const uIdIndex = 0;
    const n = userIds.length;
    let teamIds = [];
    for (const team of teams) {
	teamIds.push(await createTeam(team.title, team.desiredRank, team.desiredRole, team.region, team.description, userIds[uIdIndex]));
	if (uIdIndex >= n - 1) {
	    uIdIndex = 0;
	}
    }
    return teamIds;
}

export { teams, seedTeams };

