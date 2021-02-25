const Discord = require('discord.js');
const { getStats } = require('../../core');

const wzImg = 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/131710af-43c2-4262-8c2d-2f725537839c/ddt88yy-dd478881-8ce2-4f49-b5ee-7e49d3813c71.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvMTMxNzEwYWYtNDNjMi00MjYyLThjMmQtMmY3MjU1Mzc4MzljXC9kZHQ4OHl5LWRkNDc4ODgxLThjZTItNGY0OS1iNWVlLTdlNDlkMzgxM2M3MS5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.xyoz-VdZfHBTK-N5_ZGv2OabZ_yDvwiSiPIgWODzpHE';

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
      .setThumbnail(wzImg)
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