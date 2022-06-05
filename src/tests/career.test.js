const assert = require('assert');
const sinon = require('sinon');

const core = require('../core');

const stubGetCareer = sinon.stub(core, 'getCareer');

const career = require('../commands/wz/career');

const gamertag = 'diegofigs#1120';
const platform = 'battle';

describe('career', () => {
  const fakeSend = sinon.fake();
  const message = { channel: { send: fakeSend } };

  afterEach(() => {
    stubGetCareer.reset();
    fakeSend.resetHistory();
  });
  it('should return message if gamertag or platform are empty', async () => {
    await career.execute(message, [gamertag, '']);
    await career.execute(message, ['', platform]);

    assert(stubGetCareer.notCalled);
    assert(fakeSend.calledTwice);
    assert(fakeSend.getCalls().every((call) => call.firstArg.includes('Bad Request')));
  });

  it('should return message if gamertag or platform are invalid', async () => {
    stubGetCareer.rejects();

    await career.execute(message, [gamertag, platform]);

    assert(fakeSend.calledOnce);
    assert(fakeSend.lastCall.firstArg.includes('Not Found'));
  });

  it('should return embed if gamertag and platform are valid', async () => {
    stubGetCareer.resolves({
      kills: 0, deaths: 0, wins: 0, kdRatio: 0
    });

    await career.execute(message, [gamertag, platform]);

    assert(stubGetCareer.calledOnceWith({ gamertag, platform }));
    assert(fakeSend.calledOnce);
    assert.ok(fakeSend.lastCall.firstArg);
  });
});
