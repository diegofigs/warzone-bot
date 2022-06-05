/* eslint-disable global-require */
/* eslint-disable no-restricted-syntax */
const fs = require("fs");
const Discord = require("discord.js");

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS] });
client.commands = new Discord.Collection();

const commandFolders = fs.readdirSync("./src/commands");
for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./src/commands/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const command = require(`./src/commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.DISCORD_TOKEN);

process.on("SIGINT", (msg) => {
  // process reload ongoing
  // close connections, clear cache, etc
  // by default, you have 1600ms
  console.log(`${msg} Grafully shutting down`);
  process.exit(0);
});
