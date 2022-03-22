const { request } = require('gaxios');
const players = require('../data');

const API = 'https://wz-bot.vercel.app/api';

const headers = { 'Content-Type': 'application/json' };

const getHighlights = async ({ gamertag, platform }) => {
  try {
    const body = JSON.stringify({ gamertag, platform });
    const response = await request({
      url: `${API}/highlights`,
      method: 'POST',
      headers,
      body,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return { mostKills: 0, highestKD: 0 };
  }
};

const getHighlightsWithTag = async ({ gamertag, platform }) => {
  const highlights = await getHighlights({ gamertag, platform });
  return { gamertag, ...highlights };
};

const getHighlightsBulk = async () => {
  const playerStats = await Promise.all(
    players.map((player) => getHighlightsWithTag(player))
  );

  const playerEntries = playerStats.filter(
    ({ mostKills, highestKD }) => mostKills || highestKD
  );
  const byKills = [...playerEntries].sort((a, b) => b.mostKills - a.mostKills);
  const byKDR = [...playerEntries].sort((a, b) => b.highestKD - a.highestKD);

  return { byKills, byKDR };
};
exports.getHighlightsBulk = getHighlightsBulk;
