const Discord = require('discord.js');
const { getCareer } = require('../../core');
const { thumbnail } = require('../../config');

module.exports = {
  name: 'career',
  description: 'Fetch Ranked BR Kills, Wins, KD',
  args: true,
  usage: '<gamertag> <platform>',
  execute: async (message, args) => {
    const [gamertag, platform] = args;
    try {
      const { kills, wins, kdRatio } = await getCareer({ gamertag, platform });
      const kd = Math.floor(kdRatio * 100) / 100;
      const careerEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(`${gamertag}'s BR Career`)
        .setDescription('Brought to you by wz-bot')
        .setThumbnail(thumbnail)
        .addFields(
          { name: 'Kills', value: kills, inline: true },
          { name: 'Wins', value: wins, inline: true },
          { name: 'KD', value: kd, inline: true },
        )
        .setTimestamp()
        .setFooter('This information is property of Infinity Ward');
      message.channel.send(careerEmbed);
    } catch (e) {
      console.log('error', e);
    }
  },
};
