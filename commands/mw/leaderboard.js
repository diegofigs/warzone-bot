const fs = require('fs');
const Discord = require('discord.js');
const { emojis, getLeaderboard } = require('../../core');
const { thumbnail } = require('../../config');

const dataFiles = fs.readdirSync(`./data`).filter(file => file.endsWith('.js'));
const players = dataFiles.map(file => {
  const player = require(`../../data/${file}`);
  return player;
});

module.exports = {
  name: 'leaderboard',
	description: `Fetch squad's rankings ordered by Kills and KD`,
	execute: async (message) => {
    try {
      const { playerStatsByKills, playerStatsByRatio } = await getLeaderboard(players);
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
      await message.channel.send(killsLeaderboardEmbed);

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
      await message.channel.send(ratioLeaderboardEmbed);
    } catch (e) {
      console.log('error', e);
    }
  },
};