const fetch = require("node-fetch");

const API = "https://wz-bot.vercel.app/api";
const headers = { "Content-Type": "application/json" };

const getCareer = async ({ gamertag, platform }) => {
  const body = JSON.stringify({ gamertag, platform });
  const response = await fetch(`${API}/career`, {
    method: "POST",
    headers,
    body,
  });
  return response.json();
};
exports.getCareer = getCareer;

const getHighlights = async ({ gamertag, platform }) => {
  const body = JSON.stringify({ gamertag, platform });
  const response = await fetch(`${API}/highlights`, {
    method: "POST",
    headers,
    body,
  });
  return response.json();
};
exports.getHighlights = getHighlights;

const getStats = async ({ gamertag, platform }) => {
  const body = JSON.stringify({ gamertag, platform });
  const response = await fetch(`${API}/stats`, {
    method: "POST",
    headers,
    body,
  });
  return response.json();
};
exports.getStats = getStats;

const getHighlightsWithTag = async ({ gamertag, platform }) => {
  const highlights = await getHighlights({ gamertag, platform });
  return { gamertag, ...highlights };
};

/**
 * Get match stats from `players` ordered by kills, KD ratios; delimited
 * by an optional `interval` parameter.
 * @param {any[]} players list of player objects with `gamertag`, `platform`
 * @param {{ start: Date, end: Date }} interval interval object with `start`, `end` dates
 */
const getHighlightsBulk = async (players) => {
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
