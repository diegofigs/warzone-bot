const assert = require("assert");
const sinon = require("sinon");

const core = require("../core");

const stubGetLeaderboard = sinon.stub(core, "getHighlightsBulk");

const leaderboard = require("../commands/leaderboard");

describe("leaderboard", () => {
  const fakeSend = sinon.fake();
  const stubGetString = sinon.stub();
  const message = {
    reply: fakeSend,
    options: { getString: stubGetString },
  };

  afterEach(() => {
    stubGetLeaderboard.reset();
    stubGetString.reset();
    fakeSend.resetHistory();
  });

  it("should return message if leaderboard cannot be fetched", async () => {
    stubGetLeaderboard.rejects();

    await leaderboard.execute(message);

    assert(fakeSend.calledOnce);
    assert(fakeSend.lastCall.firstArg.includes("Not Found"));
  });

  it("should return embeds", async () => {
    stubGetLeaderboard.resolves({
      byKills: [],
      byKDR: [],
    });

    await leaderboard.execute(message);

    assert(stubGetLeaderboard.calledOnce);
    assert(fakeSend.calledTwice);
    assert.ok(fakeSend.lastCall.firstArg);
  });
});
