const bluebird = require('bluebird');

const getCareer = async ({ gamertag, platform }) => {
  const body = { gamertag, platform };
  const response = await fetch('https://wz-bot-api.vercel.com/api/career', {
    method: 'POST',
    body,
  });
  return response.json();
};
exports.getCareer = getCareer;

const getHighlights = async ({ gamertag, platform }) => {
  const body = { gamertag, platform };
  const response = await fetch('https://wz-bot-api.vercel.com/api/highlights', {
    method: 'POST',
    body,
  });
  return response.json();
};
exports.getHighlights = getHighlights;

const getStats = async ({ gamertag, platform }) => {
  const body = { gamertag, platform };
  const response = await fetch('https://wz-bot-api.vercel.com/api/stats', {
    method: 'POST',
    body,
  });
  return response.json();
};
exports.getStats = getStats;

/**
 * Get match stats from `players` ordered by kills, KD ratios; delimited
 * by an optional `interval` parameter.
 * @param {any[]} players list of player objects with `gamertag`, `platform`
 * @param {{ start: Date, end: Date }} interval interval object with `start`, `end` dates
 */
const getHighlightsBulk = async (players) => {
  const playerStats = await bluebird.map(
    players,
    (player) => getHighlights(player),
    { concurrency: 0 }
  );

  const playerEntries = playerStats.filter(
    ({ mostKills, highestKD }) => mostKills || highestKD
  );
  const byKills = [...playerEntries].sort((a, b) => b.mostKills - a.mostKills);
  const byKDR = [...playerEntries].sort((a, b) => b.highestKD - a.highestKD);

  return { byKills, byKDR };
};
exports.getHighlightsBulk = getHighlightsBulk;
