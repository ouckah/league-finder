import axios from 'axios';

// Key needs to be renewed daily
const API_KEY = "RGAPI-550f23c5-d8bd-42f1-ad70-58343f9ee48a";

let region = "na1"
let BASE_URL = `https://${region}.api.riotgames.com`  // Adjust region if needed
const BASE_URL_2 = "https://americas.api.riotgames.com";

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



export { getPuuid, getRank };
