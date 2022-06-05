module.exports = {
  name: 'ready',
  once: true,
  execute: (client) => {
    console.info(`Logged in as ${client.user.tag} at ${new Date().toLocaleString('en')}`);
    client.user.setPresence({
      activity: {
        name: 'wz-bot.io | !help',
        type: 'PLAYING'
      }
    });
  },
};
