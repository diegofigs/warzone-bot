const fs = require('fs');
const schedule = require('node-schedule');
const Discord = require('discord.js');
const { thumbnail, webhookConfig } = require('../config');
const { getStats } = require('../core');

const rule = new schedule.RecurrenceRule();
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
    for (const player of players) {
      const { gamertag } = player;
      const stats = await getStats(player);

      if (Object.values(stats).some(stat => stat !== undefined)) {
        const { highestKills, mostDeaths } = stats;
        const statsEmbed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle(`${gamertag}'s Stats of the Day`)
          .setDescription('Brought to you by wz-bot')
          .setThumbnail(thumbnail)
          .addFields(
            { name: 'Highest Kills', value: highestKills, inline: true },
            { name: 'Most Deaths', value: mostDeaths, inline: true },
          )
          .setTimestamp()
          .setFooter('This information is property of Infinity Ward');

        webhookClient.send(statsEmbed);
      }
    }

    console.log('This job was supposed to run at ' + fireDate + ', but actually ran at ' + new Date());
  }
};