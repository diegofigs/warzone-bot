const Discord = require('discord.js');
const { startOfDay, subDays } = require('date-fns');

const { getHighlightsBulk } = require('../../core');
const { thumbnail, emojis } = require('../../config');
const players = require('../../data');

const getIntervalFromTimeframe = (timeframe) => {
	const now = new Date();
	switch (timeframe) {
	case 'today':
		return { start: startOfDay(now), end: now };
	case 'yesterday':
		return { start: startOfDay(subDays(now, 1)), end: startOfDay(now) };
	case '':
	default:
		return undefined;
	}
};

const getPositionEmoji = (position) => {
	switch (position) {
	case 1:
		return emojis.crown;
	case 2:
		return emojis.runner;
	default:
		return '';
	}
};

const getNumberEmoji = (position) => emojis[position];

const HIGH_KILL_THRESHOLD = 20;
const GREAT_KILL_THRESHOLD = 13;
const GOOD_KILL_THRESHOLD = 10;
const NICE_KILL_THRESHOLD = 5;
const CHURRO = 1;
const DONUT = 0;
const getKillAccoladeEmoji = (kills) => {
	if (kills >= HIGH_KILL_THRESHOLD) {
		return emojis.bomb;
	}
	if (kills >= GREAT_KILL_THRESHOLD) {
		return emojis.green_heart;
	}
	if (kills >= GOOD_KILL_THRESHOLD) {
		return emojis.yellow_heart;
	}
	if (kills >= NICE_KILL_THRESHOLD) {
		return emojis.red_heart;
	}
	if (kills === CHURRO) {
		return emojis.bread;
	}
	if (kills === DONUT) {
		return emojis.donut;
	}
	return '';
};

const HIGH_KD_THRESHOLD = 10;
const GREAT_KD_THRESHOLD = 6;
const GOOD_KD_THRESHOLD = 3;
const getKillDeathAccoladeEmoji = (kd) => {
	if (kd >= HIGH_KD_THRESHOLD) {
		return emojis.green_heart;
	}
	if (kd >= GREAT_KD_THRESHOLD) {
		return emojis.yellow_heart;
	}
	if (kd >= GOOD_KD_THRESHOLD) {
		return emojis.red_heart;
	}
	return '';
};
const footer = { text: 'This information is property of Infinity Ward' };

module.exports = {
	name: 'leaderboard',
	aliases: ['rankings'],
	args: false,
	usage: '<timeframe? today|yesterday>',
	description: 'Fetch squad\'s rankings ordered by Kills and KD',
	execute: async (message, args) => {
		const [timeframe] = args;
		const interval = getIntervalFromTimeframe(timeframe);

		try {
			const { byKills, byKDR } = await getHighlightsBulk(players, interval);
			const embedColor = '#0099ff';
			const description = `Based on ${timeframe ? `${timeframe}'s` : 'last 20'} matches`;

			const killsFields = byKills.map(({ gamertag, mostKills }, i) => {
				const position = i + 1;
				const name = `${getNumberEmoji(position)} ${getPositionEmoji(position)} **${gamertag}**`;
				const value = `${getKillAccoladeEmoji(mostKills)} ${mostKills} Kills`;
				return { name, value };
			});
			const killsLeaderboardEmbed = new Discord.MessageEmbed()
				.setColor(embedColor)
				.setTitle('Kills Leaderboard')
				.setDescription(description)
				.setThumbnail(thumbnail)
				.addFields(killsFields)
				.setTimestamp()
				.setFooter(footer);
			await message.channel.send(killsLeaderboardEmbed);

			const ratioFields = byKDR.map(({ gamertag, highestKD }, i) => {
				const position = i + 1;
				const name = `${getNumberEmoji(position)} ${getPositionEmoji(position)} **${gamertag}**`;
				const value = `${getKillDeathAccoladeEmoji(highestKD)} ${highestKD} KD`;
				return { name, value };
			});
			const ratioLeaderboardEmbed = new Discord.MessageEmbed()
				.setColor(embedColor)
				.setTitle('KD Leaderboard')
				.setDescription(description)
				.setThumbnail(thumbnail)
				.addFields(ratioFields)
				.setTimestamp()
				.setFooter(footer);
			await message.channel.send(ratioLeaderboardEmbed);
		}
		catch (e) {
			message.channel.send('Not Found: error fetching player data');
		}
	},
};
