const Discord = require('discord.js');
const { startOfDay } = require('date-fns');

const { getPlayerHighlights } = require('../../core');
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
      const now = new Date();
      const interval = { start: startOfDay(now), end: now };
      const { mostKills, highestKD } = await getPlayerHighlights({ gamertag, platform }, interval);
      const statsEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${gamertag}'s Stats of the Day`)
        .setDescription('Brought to you by wz-bot')
        .setThumbnail(thumbnail)
        .addFields(
          { name: 'Most Kills', value: mostKills, inline: true },
          { name: 'Highest KD', value: highestKD, inline: true },
        )
        .setTimestamp()
        .setFooter('This information is property of Infinity Ward');

      message.channel.send(statsEmbed);
    } catch (e) {
      console.log('error', e);
    }
  },
};
