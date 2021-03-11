const schedule = require('node-schedule');
const Discord = require('discord.js');
const { startOfDay, subDays } = require('date-fns');

const { emojis, thumbnail, webhookConfig } = require('../config');
const { getHighlights } = require('../core');
const players = require('../data');

const rule = new schedule.RecurrenceRule();
rule.minute = 0;
rule.hour = 0;
rule.tz = 'America/Puerto_Rico';

const { dailyStats } = webhookConfig;
const webhookClient = new Discord.WebhookClient(dailyStats.webhookID, dailyStats.webhookToken);

const getPositionEmoji = (position) => {
  switch (position) {
    case 1:
      return emojis.crown;
    case 2:
      return emojis.runner;
    default:
      return '';
  }
};

const getNumberEmoji = (position) => emojis[position];

const HIGH_KILL_THRESHOLD = 20;
const GREAT_KILL_THRESHOLD = 13;
const GOOD_KILL_THRESHOLD = 10;
const NICE_KILL_THRESHOLD = 5;
const CHURRO = 1;
const DONUT = 0;
const getKillAccoladeEmoji = (kills) => {
  if (kills >= HIGH_KILL_THRESHOLD) {
    return emojis.bomb;
  }
  if (kills >= GREAT_KILL_THRESHOLD) {
    return emojis.green_heart;
  }
  if (kills >= GOOD_KILL_THRESHOLD) {
    return emojis.yellow_heart;
  }
  if (kills >= NICE_KILL_THRESHOLD) {
    return emojis.red_heart;
  }
  if (kills === CHURRO) {
    return emojis.bread;
  }
  if (kills === DONUT) {
    return emojis.donut;
  }
  return '';
};

const HIGH_KD_THRESHOLD = 10;
const GREAT_KD_THRESHOLD = 6;
const GOOD_KD_THRESHOLD = 3;
const getKillDeathAccoladeEmoji = (kd) => {
  if (kd >= HIGH_KD_THRESHOLD) {
    return emojis.green_heart;
  }
  if (kd >= GREAT_KD_THRESHOLD) {
    return emojis.yellow_heart;
  }
  if (kd >= GOOD_KD_THRESHOLD) {
    return emojis.red_heart;
  }
  return '';
};

const JOB_NAME = 'dailyStats';
module.exports = {
  name: JOB_NAME,
  rule,
  execute: async (fireDate) => {
    console.log(`[${JOB_NAME}] started at ${fireDate}`);
    const today = startOfDay(new Date());
    const yesterday = subDays(today, 1);
    const interval = { start: yesterday, end: today };
    const { byKills, byKDR } = await getHighlights(players, interval);

    const embedColor = '#0099ff';
    const description = 'Based on today\'s matches';
    const footer = 'This information is property of Infinity Ward';

    const killsFields = byKills.map(({ gamertag, mostKills }, i) => {
      const position = i + 1;
      const name = `${getNumberEmoji(position)} ${getPositionEmoji(position)} **${gamertag}**`;
      const value = `${getKillAccoladeEmoji(mostKills)} ${mostKills} Kills`;
      return { name, value };
    });
    const killsLeaderboardEmbed = new Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle('Kills Leaderboard')
      .setDescription(description)
      .setThumbnail(thumbnail)
      .addFields(killsFields)
      .setTimestamp()
      .setFooter(footer);
    await webhookClient.send(killsLeaderboardEmbed);

    const ratioFields = byKDR.map(({ gamertag, highestKD }, i) => {
      const position = i + 1;
      const name = `${getNumberEmoji(position)} ${getPositionEmoji(position)} **${gamertag}**`;
      const value = `${getKillDeathAccoladeEmoji(highestKD)} ${highestKD} KD`;
      return { name, value };
    });
    const ratioLeaderboardEmbed = new Discord.MessageEmbed()
      .setColor(embedColor)
      .setTitle('KD Leaderboard')
      .setDescription(description)
      .setThumbnail(thumbnail)
      .addFields(ratioFields)
      .setTimestamp()
      .setFooter(footer);
    await webhookClient.send(ratioLeaderboardEmbed);

    console.log(`[${JOB_NAME}] finished at ${new Date()}`);
  }
};
