const fs = require('fs');
const schedule = require('node-schedule');
const Discord = require('discord.js');
const { thumbnail, webhookConfig } = require('../config');
const { emojis, getDailyStats } = require('../core');

const rule = new schedule.RecurrenceRule();
rule.minute = 0;
rule.hour = 0;
rule.tz = 'America/Puerto_Rico';

const dataFiles = fs.readdirSync(`./data`).filter(file => file.endsWith('.js'));
const players = dataFiles.map(file => {
  const player = require(`../data/${file}`);
  return player;
});

const { dailyStats } = webhookConfig;
const webhookClient = new Discord.WebhookClient(dailyStats.webhookID, dailyStats.webhookToken);

module.exports = {
  name: 'dailyStats',
  rule,
  execute: async (fireDate) => {
    const { playerStatsByKills, playerStatsByRatio } = await getDailyStats(players);
    
    const killsFields = playerStatsByKills.map((player, position) => {
      const name = `${emojis[position+1]} **${player.gamertag}**`;
      const value = player.mostKills;
      return { name, value };
    });
    const killsLeaderboardEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Kills Leaderboard`)
      .setDescription(`Ordered by last 20's highest kill games`)
      .setThumbnail(thumbnail)
      .addFields(killsFields)
      .setTimestamp()
      .setFooter('This information is property of Infinity Ward');
    await webhookClient.send(killsLeaderboardEmbed);

    const ratioFields = playerStatsByRatio.map((player, position) => {
      const name = `${emojis[position+1]} **${player.gamertag}**`;
      const value = player.highestKD;
      return { name, value };
    });
    const ratioLeaderboardEmbed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`KD Leaderboard`)
      .setDescription(`Ordered by last 20's highest KD ratio games`)
      .setThumbnail(thumbnail)
      .addFields(ratioFields)
      .setTimestamp()
      .setFooter('This information is property of Infinity Ward');
    await webhookClient.send(ratioLeaderboardEmbed);

    console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
  }
};