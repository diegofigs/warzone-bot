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

  return {
    highestKills,
    mostDeaths
  };
};

/**
 * Get daily match stats from `players` ordered by kills, KD ratios.
 * @param {{ gamertag, platform }[]} players list of player objects
 */
exports.getDailyStats = async (players) => {
  if (CREDENTIALS.username && CREDENTIALS.password) {
    await API.login(CREDENTIALS.username, CREDENTIALS.password);
  }

  const playerStats = await Promise.map(players, async ({ gamertag, platform }) => {
    const { matches } = await API.MWcombatwz(gamertag, platform);
    const matchesOfDay = matches.filter(match => {
      const start = startOfDay(new Date());
      const timestamp = new Date(match.utcEndSeconds * 1000);
      const result = isAfter(timestamp, start);
      return result;
    });
    
    const stats = matchesOfDay.reduce((stats, match) => {
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

  return {
    playerStatsByKills: playerStats.sort((a, b) => b.mostKills - a.mostKills),
    playerStatsByRatio: playerStats.sort((a, b) => b.highestKD - a.highestKD)
  };
};

/**
 * Get last 20 matches' stats from `players` ordered by kills, KD ratios.
 * @param {{ gamertag: string, platform: string }[]} players array of player objects
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
    }, {});

    return { gamertag, ...stats };
  }, { concurrency: 0 });

  return {
    playerStatsByKills: playerStats.sort((a, b) => b.mostKills - a.mostKills),
    playerStatsByRatio: playerStats.sort((a, b) => b.highestKD - a.highestKD)
  };
};
