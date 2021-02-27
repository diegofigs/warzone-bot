const schedule = require('node-schedule');
const Discord = require('discord.js');
const { thumbnail, webhookConfig } = require('../config');
const { emojis, getDailyStats } = require('../core');
const players = require('../data');

const rule = new schedule.RecurrenceRule();
rule.minute = 0;
rule.hour = 0;
rule.tz = 'America/Puerto_Rico';

const { dailyStats } = webhookConfig;
const webhookClient = new Discord.WebhookClient(dailyStats.webhookID, dailyStats.webhookToken);

const JOB_NAME = 'dailyStats';
module.exports = {
  name: JOB_NAME,
  rule,
  execute: async (fireDate) => {
    console.log(`[${JOB_NAME}] started at ${fireDate}`);
    const { byKills, byKDR } = await getDailyStats(players);
    
    const killsFields = byKills
      .map((player, position) => {
        const name = `${emojis[position+1]} **${player.gamertag}**`;
        const value = `${player.mostKills} kills`;
        return { name, value };
      });
    const killsLeaderboardEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Kills Leaderboard`)
      .setDescription(`Based on today's games`)
      .setThumbnail(thumbnail)
      .addFields(killsFields)
      .setTimestamp()
      .setFooter('This information is property of Infinity Ward');
    await webhookClient.send(killsLeaderboardEmbed);

    const ratioFields = byKDR
      .map((player, position) => {
        const name = `${emojis[position+1]} **${player.gamertag}**`;
        const value = `${player.highestKD} KD`;
        return { name, value };
      });
    const ratioLeaderboardEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`KD Leaderboard`)
      .setDescription(`Based on today's games`)
      .setThumbnail(thumbnail)
      .addFields(ratioFields)
      .setTimestamp()
      .setFooter('This information is property of Infinity Ward');
    await webhookClient.send(ratioLeaderboardEmbed);

    console.log(`[${JOB_NAME}] finished at ${new Date()}`);
  }
};