const assert = require("assert");
const sinon = require("sinon");
const core = require("../core");

const stubGetHighlights = sinon.stub(core, "getHighlights");

const highlights = require("../commands/highlights");

const gamertag = "diegofigs#1120";
const platform = "battle";

describe("highlights", () => {
  const fakeSend = sinon.fake();
  const stubGetString = sinon.stub();
  const message = {
    reply: fakeSend,
    options: { getString: stubGetString },
  };

  afterEach(() => {
    stubGetHighlights.reset();
    stubGetString.reset();
    fakeSend.resetHistory();
  });
  it("should return message if gamertag or platform are empty", async () => {
    stubGetString
      .withArgs("gamertag")
      .onFirstCall()
      .returns(gamertag)
      .onSecondCall()
      .returns("");
    stubGetString
      .withArgs("platform")
      .onFirstCall()
      .returns("")
      .onSecondCall()
      .returns(platform);
    await highlights.execute(message);
    await highlights.execute(message);

    assert(stubGetHighlights.notCalled);
    assert(fakeSend.calledTwice);
    assert(
      fakeSend.getCalls().every((call) => call.firstArg.includes("Bad Request"))
    );
  });

  it("should return message if gamertag or platform are invalid", async () => {
    stubGetString.withArgs("gamertag").onFirstCall().returns(gamertag);
    stubGetString.withArgs("platform").onFirstCall().returns(platform);
    stubGetHighlights.rejects();

    await highlights.execute(message);

    assert(fakeSend.calledOnce);
    assert(fakeSend.lastCall.firstArg.includes("Not Found"));
  });

  it("should return embed if gamertag and platform are valid", async () => {
    stubGetString.withArgs("gamertag").onFirstCall().returns(gamertag);
    stubGetString.withArgs("platform").onFirstCall().returns(platform);
    stubGetHighlights.resolves({
      mostKills: 0,
      highestKD: 0,
    });

    await highlights.execute(message, [gamertag, platform]);

    assert(stubGetHighlights.calledOnceWith({ gamertag, platform }));
    assert(fakeSend.calledOnce);
    assert.ok(fakeSend.lastCall.firstArg);
  });
});
