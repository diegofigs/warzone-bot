const WzApiFactory = require('call-of-duty-api');
const bluebird = require('bluebird');
const { isAfter, startOfDay } = require('date-fns');

const emojis = require('./emojis');

const CREDENTIALS = {
  username: process.env.WZ_USERNAME,
  password: process.env.WZ_PASSWORD
};
const API = WzApiFactory();
const Promise = bluebird.Promise;

exports.emojis = emojis;

exports.getCareer = async ({ gamertag, platform }) => {
  if (CREDENTIALS.username && CREDENTIALS.password) {
    await API.login(CREDENTIALS.username, CREDENTIALS.password);
  }

  const career = await API.MWBattleData(gamertag, platform);
  const { br: brCareerStats } = career;
  const { kills, wins, kdRatio } = brCareerStats;

  return { kills, wins, kdRatio };
};

exports.getStats = async ({ gamertag, platform }) => {
  if (CREDENTIALS.username && CREDENTIALS.password) {
    await API.login(CREDENTIALS.username, CREDENTIALS.password);

    // const userInfo = await API.getLoggedInUserInfo();
    // console.log('Logged In Info')
    // logStats(userInfo);
  }

  const wzMatchDetails = await API.MWcombatwz(gamertag, platform);
  const matchesOfDay = wzMatchDetails.matches.filter(match => {
    const start = startOfDay(new Date());
    const timestamp = new Date(match.utcEndSeconds * 1000);
    const result = isAfter(timestamp, start);
    return result;
  });
  const highestKills = matchesOfDay.map(match => match.playerStats.kills).sort((a, b) => b - a)[0];
  const mostDeaths = matchesOfDay.map(match => match.playerStats.deaths).sort((a, b) => b - a)[0];

  // const latestMatch = wzMatchDetails.matches[0];

  // const { matchID } = latestMatch;
  // const fullMatch = await API.MWFullMatchInfowz(matchID, CREDENTIALS.platform);
  // console.log('Full Match');
  // for (const [stat, value] of Object.entries(fullMatch.allPlayers[0].player)) {
  //   console.log(stat, value);
  // }

  // const playerInMatch = fullMatch.allPlayers.find(entry => entry.player.username === CREDENTIALS.playerName);
  // console.log('Player in allPlayers');
  // console.log(playerInMatch);

  return {
    highestKills,
    mostDeaths
  };
};

/**
 * 
 * @param {Array<{ gamertag, platform }>} players list of player objects
 */
exports.getLeaderboard = async (players) => {
  if (CREDENTIALS.username && CREDENTIALS.password) {
    await API.login(CREDENTIALS.username, CREDENTIALS.password);
  }

  const playerStats = await Promise.map(players, async ({ gamertag, platform }) => {
    const { matches } = await API.MWcombatwz(gamertag, platform);
    
    const stats = matches.reduce((stats, match) => {
      const { playerStats: { kills, kdRatio } } = match;
      if (!stats.mostKills || stats.mostKills < kills) {
        stats.mostKills = kills;
      }
      if (!stats.highestKD || stats.highestKD < kdRatio) {
        stats.highestKD = kdRatio;
      }
      return stats;
    }, {
      mostKills: undefined,
      highestKD: undefined,
    });

    return { gamertag, ...stats };
  }, { concurrency: 0 });

  const playerStatsByKills = playerStats.sort((a, b) => b.mostKills - a.mostKills);
  const playerStatsByRatio = playerStats.sort((a, b) => b.highestKD - a.highestKD);

  return {
    playerStatsByKills,
    playerStatsByRatio
  };
};
