const assert = require('assert');
const sinon = require('sinon');

const core = require('../core');

const stubGetLeaderboard = sinon.stub(core, 'getHighlightsBulk');

const leaderboard = require('../commands/wz/leaderboard');

const gamertag = 'diegofigs#1120';
const platform = 'battle';

describe('leaderboard', () => {
	const fakeSend = sinon.fake();
	const message = { channel: { send: fakeSend } };

	afterEach(() => {
		stubGetLeaderboard.reset();
		fakeSend.resetHistory();
	});

	it('should return message if leaderboard cannot be fetched', async () => {
		stubGetLeaderboard.rejects();

		await leaderboard.execute(message, [gamertag, platform]);

		assert(fakeSend.calledOnce);
		assert(fakeSend.lastCall.firstArg.includes('Not Found'));
	});

	it('should return embeds', async () => {
		stubGetLeaderboard.resolves({
			byKills: [],
			byKDR: [],
		});

		await leaderboard.execute(message, [gamertag, platform]);

		assert(stubGetLeaderboard.calledOnce);
		assert(fakeSend.calledTwice);
		assert.ok(fakeSend.lastCall.firstArg);
	});
});
