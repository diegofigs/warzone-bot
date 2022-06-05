// tests/hooks.js
const sinon = require("sinon");
const Discord = require("discord.js");

// Restores the default sandbox after every test
exports.mochaHooks = {
  beforeEach() {
    sinon.mock(Discord.MessageEmbed);
    sinon.stub(console, "log");
    sinon.stub(console, "error");
  },
  afterEach() {
    console.log.restore();
    console.error.restore();
    sinon.restore();
  },
};
