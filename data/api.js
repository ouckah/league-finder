import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Key needs to be renewed daily
const API_KEY = process.env.RIOT_API_KEY;

/**
 * 
 * @param {string} summonerName - Name of the summoner
 * @param {string} tagline - Tagline of the summoner (after the #)
 * @param {string} region - Region of the summoner (NA, EUW, EUNE, etc.)
 * @returns {string} - Encrypted PUUID of the player. Used for other Riot API calls..
 */
const getPuuid = async (summonerName, tagline, region) => {
    // Currently only have NA region, need to add other region codes
    let regionUrl = region
    if (region === "NA") {
        regionUrl = "americas"
    } else if (region === "KR") {
        regionUrl = "asia"
    } else if (region === "EUW") {
        regionUrl = "europe"
    }
    const headers = { "X-Riot-Token": API_KEY };
    const puuidUrl = `https://${regionUrl}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${summonerName}/${tagline}`;
    try {
        const response = await axios.get(puuidUrl, { headers });
        return response.data.puuid;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                throw "Error: Expired/Invalid Riot API Key.";
            } else {
                throw "Error: RiotId does not exist.";
            }
        }
        throw "Error: RiotId does not exist.";
    }
}

/**
 * @param {string} puuid - Encrypted PUUID of the player. Use getPuuid() to get this.
 * @param {string} region - Region of the player (NA, EUW, EUNE, etc.)
 * @returns {Object} - Contains tier, rank, and LP of the player for ranked solo/duo. If masters+, rank will be an empty string.
 */
const getRank = async (puuid, region) => {
    let regionUrl = region
    if (region === "NA") {
        regionUrl = "na1"
    } else if (region === "KR") {
        regionUrl = "kr"
    } else if (region === "EUW") {
        regionUrl = "euw1"
    }
    const headers = { "X-Riot-Token": API_KEY };
    const rankUrl = `https://${regionUrl}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`;
    try {
        const response = await axios.get(rankUrl, { headers });
        if (!response.data) {
            throw "Error: No rank data found.";
        };
        let tier = "";
        let rank = "";
        let lp = 0;
        for (const entry of response.data) {
            if (entry.queueType === "RANKED_SOLO_5x5") {
                tier = entry.tier;
                if (tier === "MASTER" || tier === "GRANDMASTER" || tier === "CHALLENGER") {
                    rank = "";
                } else {
                    rank = entry.rank;
                }
                lp = entry.leaguePoints;
            }
        }
        return {
            tier: tier,
            rank: rank,
            lp: lp,
        }
    } catch (error) {
        if (error.response) {
            if (error.response.status === 403) {
                throw "Error: Expired Riot API Key.";
            } else if (error.response.status === 404) {
                throw `Error: Link ${rankUrl} is wrong.`;
            } else {
                throw `Error: ${error.response.message}.`;
            }
        }
        throw "Error: Failed to fetch rank.";
    }
}

/**
 * @param {string} puuid - Encrypted PUUID of the player. Use getPuuid() to get this.
 * @param {string} region - Region of the player (NA, EUW, EUNE, etc.)
 * @returns {Object} - Contains wins, losses, and win rate of the player for ranked solo/duo.
 */
const getWinLoss = async (puuid, region) => {
    let regionUrl = region
    if (region === "NA") {
        regionUrl = "na1"
    } else if (region === "KR") {
        regionUrl = "kr"
    } else if (region === "EUW") {
        regionUrl = "euw1"
    }
    const headers = { "X-Riot-Token": API_KEY };
    const playerInfoUrl = `https://${regionUrl}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`;
    try {
        const response = await axios.get(playerInfoUrl, { headers });

        for (const entry of response.data) {
            if (entry.queueType === "RANKED_SOLO_5x5") {
                const wins = entry.wins;
                const losses = entry.losses;
                const wr = ((wins / (wins + losses)) * 100).toFixed(2);
                return {
                    wins: wins,
                    losses: losses,
                    wr: wr,
                };
            }
        }
        throw "Error: No ranked solo/duo data found.";
    } catch (error) {
        throw "Error: Failed to fetch win loss.";
    }
}

/**
 * @param {string} puuid - Encrypted PUUID of the player. Use getPuuid() to get this.
 * @param {number} count - Number of matches to fetch.
 * @param {string} region - Region of the player (NA, EUW, EUNE, etc.)
 * @returns {Array} - Array of match IDs.
 */
const getMatchIds = async (puuid, count, region) => {
    let regionUrl = region;
    if (region === "NA") {
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

/**
 * @param {string} puuid - Encrypted PUUID of the player. Use getPuuid() to get this.
 * @param {string} matchId - ID of the match. Use getMatchIds() to get this.
 * @param {string} region - Region of the player (NA, EUW, EUNE, etc.)
 * @returns {Object} - Contains game mode(CLASSIC, ARAM, etc.), result(Win or Loss), champion, kills, deaths, and assists of the player for a specific match.
 */
const getMatchData = async (puuid, matchId, region) => {
    let regionUrl = region;
    if (region === "NA") {
        regionUrl = "americas"
    } else if (region === "KR") {
        regionUrl = "asia"
    } else if (region === "EUW") {
        regionUrl = "europe"
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
            champion: matchData[i].championName,
            kills: matchData[i].kills,
            deaths: matchData[i].deaths,
            assists: matchData[i].assists
        };
    } catch (error) {
        throw "Error: Failed to fetch match data.";
    }
}

/**
 * @param {string} puuid - Encrypted PUUID of the player. Use getPuuid() to get this.
 * @param {number} count - Number of matches to fetch.
 * @param {string} region - Region of the player (NA, EUW, EUNE, etc.)
 * @returns {Array} - Array of match data, uses getMatchData() to get the data for each match.
 */
const getRecentMatches = async (puuid, count, region) => {
    const matchIds = await getMatchIds(puuid, count, region);
    let results = [];
    for (const matchId of matchIds) {
        const matchData = await getMatchData(puuid, matchId, region);
        results.push(matchData);
    }
    return results;
}

/**
 * @param {string} puuid - Encrypted PUUID of the player. Use getPuuid() to get this.
 * @param {string} region - Region of the player (NA, EUW, EUNE, etc.)
 * @returns {Array} - Array of the top 3 champions the player has played based on mastery points.
 */
const getMostPlayedChampions = async (puuid, region) => {
    let regionUrl = region;
    if (region === "NA") {
        regionUrl = "na1"
    } else if (region === "KR") {
        regionUrl = "kr"
    } else if (region === "EUW") {
        regionUrl = "euw1"
    }
    const headers = { "X-Riot-Token": API_KEY };
    const topChampsUrl = `https://${regionUrl}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=3`;
    try {
        const topChamps = await axios.get(topChampsUrl, { headers });
        let champIds = topChamps.data.map(champion => champion.championId);
        let champNames = [];
        for (const champId of champIds) {
            const champName = await getChampName(champId);
            champNames.push(champName);
        }
        return champNames;
    } catch (error) {
        throw "Error: Failed to fetch most played champions.";
    }
}

/**
 * @param {number} champId - ID of the champion.
 * @returns {string} - Name of the champion.
 */
const getChampName = async (champId) => {
    const champNames = await axios.get('https://ddragon.leagueoflegends.com/cdn/15.9.1/data/en_US/champion.json');
    for (const champ in champNames.data.data) {
        if (champNames.data.data[champ].key === champId.toString()) {
            return champNames.data.data[champ].name;
        }
    }
    throw "Error: Champion not found.";
}

export { getPuuid, getRank, getWinLoss, getMatchIds, getMatchData, getRecentMatches, getMostPlayedChampions, getChampName };
