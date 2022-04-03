const assert = require('assert');
const sinon = require('sinon');
const Discord = require('discord.js');
const api = require('../src/api');

const stubGetRebirthBulk = sinon.stub(api, 'getRebirthBulk');
const stubWebhookClient = sinon.createStubInstance(Discord.WebhookClient);
sinon.stub(Discord, 'WebhookClient').returns(stubWebhookClient);
sinon.mock(Discord.MessageEmbed);

const functions = require('../index');

const MESSAGE = 'message';

describe('functions', () => {
  const jsonObject = JSON.stringify({ data: MESSAGE });
  const jsonBuffer = Buffer.from(jsonObject).toString('base64');
  const pubsubMessage = { data: jsonBuffer, publishTime: new Date() };

  let stubLog;
  let stubError;
  const stubConsole = () => {
    stubLog = sinon.stub(console, 'log');
    stubError = sinon.stub(console, 'error');
  };
  const restoreConsole = () => {
    stubLog.restore();
    stubError.restore();
  };
  beforeEach(stubConsole);
  afterEach(restoreConsole);

  describe('#sendLeaderboard', () => {
    it('should send leaderboard embeds to webhook channel', async () => {
      stubGetRebirthBulk.resolves({ byKills: [], byKDR: [] });

      await functions.sendLeaderboard(pubsubMessage);

      assert(stubGetRebirthBulk.calledOnce);
      assert(stubWebhookClient.send.calledOnce);
      assert(stubWebhookClient.send.lastCall.firstArg);
    });
  });
});
