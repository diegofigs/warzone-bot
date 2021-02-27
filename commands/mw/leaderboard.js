const fs = require('fs');
const Discord = require('discord.js');
const { emojis, getRecentMatchStats } = require('../../core');
const { thumbnail } = require('../../config');

const dataFiles = fs.readdirSync(`./data`).filter(file => file.endsWith('.js'));
const players = dataFiles.map(file => {
  const player = require(`../../data/${file}`);
  return player;
});

module.exports = {
  name: 'leaderboard',
  aliases: ['rankings'],
  description: `Fetch squad's rankings ordered by Kills and KD`,
  execute: async (message) => {
    try {
      const playerStats = await getRecentMatchStats(players);

      const killsFields = playerStats.sort((a, b) => b.mostKills - a.mostKills)
        .map((player, position) => {
          const name = `${emojis[position + 1]} **${player.gamertag}**`;
          const value = `${player.mostKills} Kills`;
          return { name, value };
        });
      const killsLeaderboardEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`Kills Leaderboard`)
        .setDescription(`Based on last 20 matches`)
        .setThumbnail(thumbnail)
        .addFields(killsFields)
        .setTimestamp()
        .setFooter('This information is property of Infinity Ward');
      await message.channel.send(killsLeaderboardEmbed);

      const ratioFields = playerStats.sort((a, b) => b.highestKD - a.highestKD)
        .map((player, position) => {
          const name = `${emojis[position + 1]} **${player.gamertag}**`;
          const value = `${player.highestKD} KD`;
          return { name, value };
        });
      const ratioLeaderboardEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`KD Leaderboard`)
        .setDescription(`Based on last 20 matches`)
        .setThumbnail(thumbnail)
        .addFields(ratioFields)
        .setTimestamp()
        .setFooter('This information is property of Infinity Ward');
      await message.channel.send(ratioLeaderboardEmbed);
    } catch (e) {
      console.log('error', e);
    }
  },
};