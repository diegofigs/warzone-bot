const Discord = require('discord.js');
const { emojis, getRecentMatchStats } = require('../../core');
const { thumbnail } = require('../../config');
const players = require('../../data');

module.exports = {
  name: 'leaderboard',
  aliases: ['rankings'],
  description: `Fetch squad's rankings ordered by Kills and KD`,
  execute: async (message) => {
    try {
      const { byKills, byKDR } = await getRecentMatchStats(players);

      const killsFields = byKills.map((player, position) => {
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

      const ratioFields = byKDR.map((player, position) => {
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