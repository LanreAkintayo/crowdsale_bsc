const ether = require("./helpers/ether");
const EVMRevert = require("./helpers/EVMRevert");
const { increaseTimeTo, duration } = require("./helpers/increaseTime");
const latestTime = require("./helpers/latestTime");

const BigNumber = web3.BigNumber;

require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

const LARToken = artifacts.require("LARToken");
const LARTokenCrowdsale = artifacts.require("LARTokenCrowdsale");
const RefundVault = artifacts.require("./RefundVault");

contract("LARTokenCrowdsale", function ([_, wallet, investor1, investor2]) {
  beforeEach(async function () {
    // Token config
    this.name = "LARToken";
    this.symbol = "LAR";
    this.decimals = 18;

    // Deploy Token
    this.token = await LARToken.new(this.name, this.symbol, this.decimals);

    // console.log("Token Address: ", this.token.address);

    // Crowdsale config
    this.rate = 500; // 500 wei = 1 token
    this.wallet = wallet;
    this.cap = ether(10);
    this.openingTime = latestTime() + duration.weeks(1); // Crowdsale will open in one weeks time
    this.closingTime = this.openingTime + duration.weeks(1); // crowdsale will close one week after it is opened.
    this.goal = ether(5);

    this.crowdsale = await LARTokenCrowdsale.new(
      this.rate,
      this.wallet,
      this.token.address,
      this.cap,
      this.openingTime,
      this.closingTime,
      this.goal
   );
   

   await this.token.pause()
   // This means that during the ICO, token can only be kept. You can only use it when it is unpause.

    await this.token.transferOwnership(this.crowdsale.address);
    // LARTokenCrowdsale will now have the ability to mint the tokens we pass to its argument.

    // Track refund vault
    this.vaultAddress = await this.crowdsale.vault();
   this.vault = RefundVault.at(this.vaultAddress); // 
   

   // console.log("Wallet Address: ", this.wallet)
   // console.log("Vault Address: ", this.vaultAddress)

    await increaseTimeTo(this.openingTime + 1);
  });

  describe("crowdsale", function () {
    it("tracks the rate", async function () {
      const rate = await this.crowdsale.rate();
      rate.should.be.bignumber.equal(this.rate);
    });

    it("tracks the wallet", async function () {
      const wallet = await this.crowdsale.wallet();
      wallet.should.equal(this.wallet);
    });

    it("tracks the token", async function () {
      const token = await this.crowdsale.token();
      token.should.equal(this.token.address);
    });
  });

  describe("time crowdsale", function () {
    it("is open", async function () {
      const isClosed = await this.crowdsale.hasClosed();
      isClosed.should.be.false;

      increaseTimeTo(this.closingTime + 1);
      const hasClosed = await this.crowdsale.hasClosed();
      hasClosed.should.be.true;
    });
  });

  describe("minted crowdsale", function () {
    it("mints tokens after purchase", async function () {
      const originalTotalSupply = await this.token.totalSupply();
      // console.log("Total supply: ", originalTotalSupply);

      await this.crowdsale.sendTransaction({
        value: ether(1),
        from: investor1,
      });
      const newTotalSupply = await this.token.totalSupply();
      assert.isTrue(newTotalSupply > originalTotalSupply);
    });
  });

  describe("capped crowdsale", async function () {
    it("has the correct hard cap", async function () {
      const cap = await this.crowdsale.cap();
      cap.should.be.bignumber.equal(this.cap);
    });
  });

  describe("accepting payments", function () {
    it("should accept payments", async function () {
      const value = ether(1);
      const purchaser = investor2;
      await this.crowdsale.sendTransaction({
        value: value,
        from: investor1,
      }).should.be.fulfilled;

      // const tokenBalance = await this.token.balanceOf(investor1);

      // console.log(
      //   "Balance of investor 1 after calling sendTransaction: ",
      //   tokenBalance.toString()
      // );

      await this.crowdsale.buyTokens(investor1, {
        value: value,
        from: purchaser,
      }).should.be.fulfilled;

      // const tokenBalance2 = await this.token.balanceOf(investor1);

      // console.log(
      //   "Balance of investor 1 after buying tokens: ",
      //   tokenBalance2.toString()
      // );
    });
  });

  describe("buyTokens()", function () {
    describe("When cap goal is reached", function () {
      it("should be rejected", async function () {
        const purchaser = investor2;

        // const tokenBalance1 = await this.token.balanceOf(investor1);
        // console.log(
        //   "Token balance before buying tokens: ",
        //   tokenBalance1.toString()
        // );

        await this.crowdsale.buyTokens(investor1, {
          value: ether(5),
          from: purchaser,
        }).should.be.fulfilled;

        const tokenBalance2 = await this.token.balanceOf(investor1);
        // console.log(
        //   "After buying token, token balance is ",
        //   tokenBalance2.toString()
        // );

        tokenBalance2.should.be.bignumber.equal(ether(5).mul(500));

        await this.crowdsale
          .buyTokens(investor2, { value: ether(10), from: purchaser })
          .should.be.rejectedWith(EVMRevert);
      });
    });
  });

  describe("refundable crowdsale", function () {
    beforeEach(async function () {
      await this.crowdsale.buyTokens(investor1, {
        value: ether(2),
        from: investor1,
      });
    });

    describe("when goal is not succesful", function () {
      it("should be able to refund users", async function () {
        await increaseTimeTo(this.closingTime + 1);

        const isClosed = await this.crowdsale.hasClosed();
       isClosed.should.be.true;

       const vaultBalance = await web3.eth.getBalance(this.vaultAddress)

       console.log("Vault Balance: ", vaultBalance.toString())

       vaultBalance.should.be.bignumber.equal(ether(2))
       
       assert.isAbove(this.goal, vaultBalance)

        // await this.vault.refund(investor1).should.be.fulfilled;
      });
    });

    describe("when goal is reached", function () {
      it("should not be able to refund to investors", async function () {
        await this.crowdsale.buyTokens(investor1, {
          value: ether(6),
          from: investor1,
        });
        await this.crowdsale
          .claimRefund({ from: investor1 })
          .should.be.rejectedWith(EVMRevert);
      });
    });
  });
 
 describe("Crowdsale finalization", function () {
  
  
  describe("when goal is reached", function () {
   beforeEach(async function () {
    await this.crowdsale.buyTokens(investor1, { value: ether(3), from: investor1 });
    await this.crowdsale.buyTokens(investor2, { value: ether(3), from: investor2 });
 
    await increaseTimeTo(this.closingTime + 1)
 
    await this.crowdsale.finalize({ from: _ })
   })

   it("should not be able to refund to investors", async function () {
    const goalReached = await this.crowdsale.goalReached()
    goalReached.should.be.true

    const mintingFinished = await this.token.mintingFinished()
    mintingFinished.should.be.true

    const paused = await this.token.paused()
    paused.should.be.false

     await this.crowdsale
       .claimRefund({ from: investor1 })
       .should.be.rejectedWith(EVMRevert);
   });
  });
  
  describe("when the goal is not reached", async function () {
   beforeEach(async function () {
    await this.crowdsale.buyTokens(investor1, { value: ether(3), from: investor1 });
  
    await increaseTimeTo(this.closingTime + 1)
 
    await this.crowdsale.finalize({ from: _ })
   })

   it("should should be able to refund the investors", async function () {
    await this.crowdsale.claimRefund({from: investor1}).should.be.fulfilled
   })
  })

  })
});
