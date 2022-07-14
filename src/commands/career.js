const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const { getCareer } = require("../core");
const { thumbnail } = require("../config");

const footer = { text: "This information is property of Infinity Ward" };

module.exports = {
  data: new SlashCommandBuilder()
    .setName("career")
    .setDescription("Fetches all time BR kills, wins, kd")
    .addStringOption((option) =>
      option
        .setName("gamertag")
        .setDescription("player to look up")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("platform")
        .setDescription("player's platform")
        .setRequired(true)
    ),
  async execute(interaction) {
    const gamertag = interaction.options.getString("gamertag");
    const platform = interaction.options.getString("platform");

    if (gamertag && platform) {
      try {
        const { kills, wins, kdRatio } = await getCareer({
          gamertag,
          platform,
        });
        const kd = Math.floor(kdRatio * 100) / 100;
        const careerEmbed = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle(`${gamertag}'s BR Career`)
          .setDescription("Brought to you by wz-bot")
          .setThumbnail(thumbnail)
          .addFields(
            { name: "Kills", value: kills.toString(), inline: true },
            { name: "Wins", value: wins.toString(), inline: true },
            { name: "KD", value: kd.toString(), inline: true }
          )
          .setTimestamp()
          .setFooter(footer);
        return interaction.reply({ embeds: [careerEmbed] });
      } catch (error) {
        return interaction.reply("Not Found: error fetching player data");
      }
    }
    return interaction.reply("Bad Request");
  },
};
