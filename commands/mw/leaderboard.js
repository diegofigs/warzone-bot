const Discord = require('discord.js');
const { emojis, getRecentMatchStats, getDailyStats } = require('../../core');
const { thumbnail } = require('../../config');
const players = require('../../data');

module.exports = {
  name: 'leaderboard',
  aliases: ['rankings'],
  args: false,
  usage: '<recent?>',
  description: `Fetch squad's rankings ordered by Kills and KD`,
  execute: async (message, args) => {
    const [recent] = args;
    try {
      const { byKills, byKDR } = recent ? await getDailyStats(players) : await getRecentMatchStats(players);
      const embedColor = '#0099ff';
      const description = `Based on ${recent ? "today's" : "last 20"} matches`;
      const footer = 'This information is property of Infinity Ward';

      const killsFields = byKills.map((player, position) => {
        const name = `${emojis[position + 1]} **${player.gamertag}**`;
        const value = `${player.mostKills} Kills`;
        return { name, value };
      });
      const killsLeaderboardEmbed = new Discord.MessageEmbed()
        .setColor(embedColor)
        .setTitle(`Kills Leaderboard`)
        .setDescription(description)
        .setThumbnail(thumbnail)
        .addFields(killsFields)
        .setTimestamp()
        .setFooter(footer);
      await message.channel.send(killsLeaderboardEmbed);

      const ratioFields = byKDR.map((player, position) => {
        const name = `${emojis[position + 1]} **${player.gamertag}**`;
        const value = `${player.highestKD} KD`;
        return { name, value };
      });
      const ratioLeaderboardEmbed = new Discord.MessageEmbed()
        .setColor(embedColor)
        .setTitle(`KD Leaderboard`)
        .setDescription(description)
        .setThumbnail(thumbnail)
        .addFields(ratioFields)
        .setTimestamp()
        .setFooter(footer);
      await message.channel.send(ratioLeaderboardEmbed);
    } catch (e) {
      console.log('error', e);
    }
  },
};