const WzApiFactory = require('call-of-duty-api');
const { isAfter, startOfDay } = require('date-fns');

const CREDENTIALS = {
  username: process.env.WZ_USERNAME,
  password: process.env.WZ_PASSWORD
};
const API = WzApiFactory();

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
