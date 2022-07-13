const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { startOfDay } = require("date-fns");

const { getHighlights } = require("../core");
const { thumbnail } = require("../config");

const footer = { text: "This information is property of Infinity Ward" };

module.exports = {
  data: new SlashCommandBuilder()
    .setName("highlights")
    .setDescription("Fetches highest kills, most deaths of the day")
    .addStringOption((option) =>
      option
        .setName("gamertag")
        .setDescription("the player to look up")
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
        const now = new Date();
        const interval = { start: startOfDay(now), end: now };
        const { mostKills, highestKD } = await getHighlights(
          { gamertag, platform },
          interval
        );
        const statsEmbed = new MessageEmbed()
          .setColor("#0099ff")
          .setTitle(`${gamertag}'s Stats of the Day`)
          .setDescription("Brought to you by wz-bot")
          .setThumbnail(thumbnail)
          .addFields(
            { name: "Most Kills", value: mostKills.toString(), inline: true },
            { name: "Highest KD", value: highestKD.toString(), inline: true }
          )
          .setTimestamp()
          .setFooter(footer);

        return interaction.channel.send({ embeds: [statsEmbed] });
      } catch (error) {
        return interaction.channel.send(
          "Not Found: error fetching player data"
        );
      }
    }
    return interaction.channel.send("Bad Request");
  },
};
