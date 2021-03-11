const WzApiFactory = require('call-of-duty-api');
const bluebird = require('bluebird');
const { isWithinInterval } = require('date-fns');

const API = WzApiFactory();

const CREDENTIALS = {
  username: process.env.WZ_USERNAME,
  password: process.env.WZ_PASSWORD,
};
const CAREER = { kills: undefined, wins: undefined, kdRatio: undefined };
const PLAYER_HIGHLIGHTS = { mostKills: undefined, highestKD: undefined };
const PLAYER_LEADERBOARD = { byKills: [], byKDR: [] };

const loginToCOD = async () => {
  try {
    if (CREDENTIALS.username && CREDENTIALS.password) {
      await API.login(CREDENTIALS.username, CREDENTIALS.password);
      return true;
    }
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

function getMatchEndTime(match) {
  return new Date(match.utcEndSeconds * 1000);
}

function findMatchesInInterval(matches, interval) {
  if (interval) {
    return matches.filter((match) => isWithinInterval(getMatchEndTime(match), interval));
  }
  return matches;
}

async function fetchPlayerHighlights({ gamertag, platform }, interval) {
  try {
    const { matches } = await API.MWcombatwz(gamertag, platform);
    const matchesWithinInterval = findMatchesInInterval(matches, interval);

    const stats = matchesWithinInterval.reduce(
      (highlights, match) => {
        const { mostKills, highestKD } = highlights;
        const { kills, kdRatio } = match.playerStats;

        return {
          mostKills: !mostKills || mostKills < kills ? kills : mostKills,
          highestKD: !highestKD || highestKD < kdRatio ? kdRatio : highestKD,
        };
      },
      { ...PLAYER_HIGHLIGHTS }
    );
    return { gamertag, ...stats };
  } catch (error) {
    return PLAYER_HIGHLIGHTS;
  }
}

const getCareer = async ({ gamertag, platform }) => {
  const loggedIn = await loginToCOD();
  if (!loggedIn) {
    return CAREER;
  }

  const career = await API.MWBattleData(gamertag, platform);
  const { br: brCareerStats } = career;
  const { kills, wins, kdRatio } = brCareerStats;

  return { kills, wins, kdRatio };
};
exports.getCareer = getCareer;

/**
 * Get match stats from `player`; delimited by an optional `interval` parameter.
 * @param {{ gamertag: string, platform: string }} player player object with `gamertag`, `platform`
 * @param {{ start: Date, end: Date }} interval interval object with `start`, `end` dates
 */
const getPlayerHighlights = async (player, interval) => {
  const loggedIn = await loginToCOD();
  if (!loggedIn) {
    return PLAYER_HIGHLIGHTS;
  }

  // Fail gracefully if a player's stats can't be fetched / aggregated
  try {
    return await fetchPlayerHighlights(player, interval);
  } catch (error) {
    return PLAYER_HIGHLIGHTS;
  }
};
exports.getPlayerHighlights = getPlayerHighlights;

/**
 * Get match stats from `players` ordered by kills, KD ratios; delimited
 * by an optional `interval` parameter.
 * @param {any[]} players list of player objects with `gamertag`, `platform`
 * @param {{ start: Date, end: Date }} interval interval object with `start`, `end` dates
 */
const getHighlights = async (players, interval) => {
  const loggedIn = await loginToCOD();
  if (!loggedIn) { return PLAYER_LEADERBOARD; }

  const playerStats = await bluebird.map(players,
    (player) => fetchPlayerHighlights(player, interval), { concurrency: 0 });

  const playerEntries = playerStats.filter(({ mostKills, highestKD }) => mostKills || highestKD);
  const byKills = [...playerEntries].sort((a, b) => b.mostKills - a.mostKills);
  const byKDR = [...playerEntries].sort((a, b) => b.highestKD - a.highestKD);

  return { byKills, byKDR };
};
exports.getHighlights = getHighlights;
