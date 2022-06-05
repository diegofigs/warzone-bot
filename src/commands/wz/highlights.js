const { MessageEmbed } = require('discord.js');
const { startOfDay } = require('date-fns');

const { getHighlights } = require('../../core');
const { thumbnail } = require('../../config');

const footer = { text: 'This information is property of Infinity Ward' };

module.exports = {
	name: 'highlights',
	description: 'Fetch Highest Kills / Most Deaths of the day',
	args: true,
	usage: '<gamertag> <platform>',
	execute: async (message, args) => {
		const [gamertag, platform] = args;
		if (!gamertag || !platform) {
			message.channel.send('Bad Request: operation requires gamertag, platform');
			return;
		}
		try {
			const now = new Date();
			const interval = { start: startOfDay(now), end: now };
			const { mostKills, highestKD } = await getHighlights({ gamertag, platform }, interval);
			const statsEmbed = new MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`${gamertag}'s Stats of the Day`)
				.setDescription('Brought to you by wz-bot')
				.setThumbnail(thumbnail)
				.addFields(
					{ name: 'Most Kills', value: mostKills.toString(), inline: true },
					{ name: 'Highest KD', value: highestKD.toString(), inline: true },
				)
				.setTimestamp()
				.setFooter(footer);

			message.channel.send({ embeds: [statsEmbed] });
		}
		catch (error) {
			message.channel.send('Not Found: error fetching player data');
		}
	},
};
