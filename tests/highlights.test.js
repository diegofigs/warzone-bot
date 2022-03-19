const assert = require('assert');
const sinon = require('sinon');
const Discord = require('discord.js');
const core = require('../core');

const stubGetHighlights = sinon.stub(core, 'getHighlights');
sinon.mock(Discord.MessageEmbed);

const highlights = require('../commands/mw/highlights');

const gamertag = 'diegofigs#1120';
const platform = 'battle';

describe('highlights', () => {
  const fakeSend = sinon.fake();
  const message = { channel: { send: fakeSend } };

  afterEach(() => {
    stubGetHighlights.reset();
    fakeSend.resetHistory();
  });
  it('should return message if gamertag or platform are empty', async () => {
    await highlights.execute(message, [gamertag, '']);
    await highlights.execute(message, ['', platform]);

    assert(stubGetHighlights.notCalled);
    assert(fakeSend.calledTwice);
    assert(fakeSend.getCalls().every((call) => call.firstArg.includes('Bad Request')));
  });

  it('should return message if gamertag or platform are invalid', async () => {
    stubGetHighlights.rejects();

    await highlights.execute(message, [gamertag, platform]);

    assert(fakeSend.calledOnce);
    assert(fakeSend.lastCall.firstArg.includes('Not Found'));
  });

  it('should return embed if gamertag and platform are valid', async () => {
    stubGetHighlights.resolves({
      mostKills: 0, highestKD: 0
    });

    await highlights.execute(message, [gamertag, platform]);

    assert(stubGetHighlights.calledOnceWith({ gamertag, platform }));
    assert(fakeSend.calledOnce);
    assert.ok(fakeSend.lastCall.firstArg.timestamp);
  });
});
