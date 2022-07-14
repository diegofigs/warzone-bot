const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Intents } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS],
  presence: { activity: { name: "with the WZ Bot" } },
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "src", "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.on("ready", (client) => {
  console.info(
    `Logged in as ${client.user.tag} at ${new Date().toLocaleString("en")}`
  );
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.DISCORD_TOKEN);

process.on("SIGINT", (msg) => {
  // process reload ongoing
  // close connections, clear cache, etc
  // by default, you have 1600ms
  console.log(`${msg} Grafully shutting down`);
  process.exit(0);
});
