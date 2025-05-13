/**import { 
    getPuuid, 
    getRank, 
    getWinLoss, 
    getRecentMatches, 
    getMostPlayedChampions 
} from '../data/api.js';

// Test data
const testSummoner = {
    name: '一只笨猫',  // Faker's account
    tagline: 'CAT',
    region: 'NA'
};

let puuid = await getPuuid(testSummoner.name, testSummoner.tagline, testSummoner.region);
console.log('Puuid:' + puuid);
let rank = await getRank(puuid, testSummoner.region);
console.log(`Rank: ${rank.tier} ${rank.rank} - ${rank.lp}`);
let wr = await getWinLoss(puuid, testSummoner.region);
console.log(`Winrate: ${wr.wr}. Wins: ${wr.wins}, Losses: ${wr.losses}`);
let matches = await getRecentMatches(puuid, 3, testSummoner.region);
for (let match of matches) {
    console.log(`Result: ${match.result}. Champ: ${match.champion}. KDA: ${match.kills}/${match.deaths}/${match.assists}.`);
}
let mastery = await getMostPlayedChampions(puuid, testSummoner.region);
console.log('Most played champions:');
console.log(mastery);*/

import helpers from '../utils/helpers.js';
import { getPuuid, getRank } from '../data/api.js';
const { checkString, checkStringArray, checkStringWithLength } = helpers;

const riotId = "Sponge#KR2";
checkStringWithLength(riotId, 3, 22, /^.{1,16}#.{1,5}$/);
console.log("Valid riotId");
let riotName = riotId.split('#');
console.log(riotName[0])
console.log(riotName[1])
const puuid = await getPuuid(riotName[0], riotName[1], 'NA');
console.log(puuid);