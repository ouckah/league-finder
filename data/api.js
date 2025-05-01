import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Key needs to be renewed daily
const API_KEY = process.env.RIOT_API_KEY;

const getPuuid = async (summonerName, tagline, region) => {
    // Currently only have NA region, need to add other region codes
    let regionUrl = region
    if (region == "NA") {
        regionUrl = "americas"
    }
    const headers = { "X-Riot-Token": API_KEY };
    const puuidUrl = `https://${regionUrl}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tagline}`;
    try {
        const response = await axios.get(puuidUrl, { headers });
        return response.data.puuid;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 403) {
                throw "Error: Expired Riot API Key.";
            } else if (error.response.status === 404) {
                throw `Error: Link ${puuidUrl} is wrong.`;
            } else {
                throw `Error: Riot API returned error code ${error.response.status}.`;
            }
        }
        throw "Error: Failed to fetch puuid.";
    }
}

const getRank = async (puuid, region) => {
    let regionUrl = region
    if (region == "NA") {
        regionUrl = "na1"
    }
    const headers = { "X-Riot-Token": API_KEY };
    const rankUrl = `https://${regionUrl}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`;
    try {
        const response = await axios.get(rankUrl, { headers });
        if (!response.data) {
            throw "Error: No rank data found.";
        };
        for (const entry of response.data) {
            if (entry.queueType == "RANKED_SOLO_5x5") {
                return {
                    tier: entry.tier,
                    rank: entry.rank,
                }
            }
        }
        throw "Error: No ranked solo/duo data found.";
    } catch (error) {
        if (error.response) {
            if (error.response.status === 403) {
                throw "Error: Expired Riot API Key.";
            } else if (error.response.status === 404) {
                throw `Error: Link ${rankUrl} is wrong.`;
            } else {
                throw `Error: Riot API returned error code ${error.response.status}.`;
            }
        }
        throw "Error: Failed to fetch rank.";
    }
}

const getMatchIds = async (puuid, count, region) => {
    let regionUrl = region;
    if (region == "NA") {
        regionUrl = "americas";
    }
    const headers = { "X-Riot-Token": API_KEY };
    const matchUrl = `https://${regionUrl}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`;
    try {
        const response = await axios.get(matchUrl, { headers });
        return response.data;
    } catch (error) {
        throw "Error: Failed to fetch matches.";
    }
}

const getMatchData = async (puuid, matchId, region) => {
    let regionUrl = region;
    if (region == "NA") {
        regionUrl = "americas";
    }
    const headers = { "X-Riot-Token": API_KEY };
    const matchUrl = `https://${regionUrl}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
    try {
        const response = await axios.get(matchUrl, { headers });
        let matchData = response.data.info.participants;
        let i = 0;
        for (const player of matchData) {
            if (player.puuid === puuid) {
                break;
            }
            i++;
        }
        return {
            mode: response.data.info.gameMode,
            result: matchData[i].win ? "Win" : "Loss",
            kills: matchData[i].kills,
            deaths: matchData[i].deaths,
            assists: matchData[i].assists
        };
    } catch (error) {
        throw "Error: Failed to fetch match data.";
    }
}

const getRecentMatches = async (puuid, count, region) => {
    const matchIds = await getMatchIds(puuid, count, region);
    let results = [];
    for (const matchId of matchIds) {
        const matchData = await getMatchData(puuid, matchId, region);
        results.push(matchData);
    }
    return results;
}

export { getPuuid, getRank, getMatchIds, getMatchData, getRecentMatches };
