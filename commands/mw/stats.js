const Discord = require('discord.js');
const { getStats } = require('../../core');

module.exports = {
  name: 'stats',
  aliases: ['highlights'],
	description: 'Fetch Highest Kills / Most Deaths',
  args: true,
  usage: '<gamertag> <platform>',
	execute: async (message, args) => {
    const [gamertag, platform] = args;
    try {
      const { highestKills, mostDeaths } = await getStats({ gamertag, platform });
      message.channel.send(`Highest Kills: ${highestKills} / Most Deaths: ${mostDeaths}`);
    } catch (e) {
      console.log('error', e);
    }
  },
};