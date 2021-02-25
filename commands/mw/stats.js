const Discord = require('discord.js');
const { getStats } = require('../../core');
const { thumbnail } = require('../../config');

module.exports = {
  name: 'stats',
  aliases: ['highlights'],
	description: 'Fetch Highest Kills / Most Deaths of the day',
  args: true,
  usage: '<gamertag> <platform>',
	execute: async (message, args) => {
    const [gamertag, platform] = args;
    try {
      const { highestKills, mostDeaths } = await getStats({ gamertag, platform });
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

      message.channel.send(statsEmbed);
    } catch (e) {
      console.log('error', e);
    }
  },
};