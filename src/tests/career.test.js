const assert = require("assert");
const sinon = require("sinon");

const core = require("../core");

const stubGetCareer = sinon.stub(core, "getCareer");

const career = require("../commands/career");

const gamertag = "diegofigs#1120";
const platform = "battle";

describe("career", () => {
  const fakeSend = sinon.fake();
  const stubGetString = sinon.stub();
  const message = {
    reply: fakeSend,
    options: { getString: stubGetString },
  };

  afterEach(() => {
    stubGetCareer.reset();
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

    await career.execute(message);
    await career.execute(message);

    assert(stubGetCareer.notCalled);
    assert(fakeSend.calledTwice);
    assert(
      fakeSend.getCalls().every((call) => call.firstArg.includes("Bad Request"))
    );
  });

  it("should return message if gamertag or platform are invalid", async () => {
    stubGetString.withArgs("gamertag").onFirstCall().returns(gamertag);
    stubGetString.withArgs("platform").onFirstCall().returns(platform);
    stubGetCareer.rejects();

    await career.execute(message);

    assert(fakeSend.calledOnce);
    assert(fakeSend.lastCall.firstArg.includes("Not Found"));
  });

  it("should return embed if gamertag and platform are valid", async () => {
    stubGetString.withArgs("gamertag").onFirstCall().returns(gamertag);
    stubGetString.withArgs("platform").onFirstCall().returns(platform);
    stubGetCareer.resolves({
      kills: 0,
      deaths: 0,
      wins: 0,
      kdRatio: 0,
    });

    await career.execute(message);

    assert(stubGetCareer.calledOnceWith({ gamertag, platform }));
    assert(fakeSend.calledOnce);
    assert.ok(fakeSend.lastCall.firstArg);
  });
});
