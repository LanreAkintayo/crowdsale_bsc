const LARToken = artifacts.require("LARToken");
const LARTokenCrowdsale = artifacts.require("LARTokenCrowdsale");

const bnb = (n) => new web3.BigNumber(web3.toWei(n, "ether"));

const duration = {
  seconds: function (val) {
    return val;
  },
  minutes: function (val) {
    return val * this.seconds(60);
  },
  hours: function (val) {
    return val * this.minutes(60);
  },
  days: function (val) {
    return val * this.hours(24);
  },
  weeks: function (val) {
    return val * this.days(7);
  },
  years: function (val) {
    return val * this.days(365);
  },
};

module.exports = async function (deployer, network, accounts) {
  const _name = "LAR Token";
  const _symbol = "LAR";
 const _decimals = 18;
 
 console.log("Deploying LARToken.......................................................")

  console.log("Deployer: ", accounts[0]);

  await deployer.deploy(LARToken, _name, _symbol, _decimals);
  const deployedToken = await LARToken.deployed();

 const latestTime = (new Date).getTime();
 
 console.log("LARToken Deployed.......................................................")


  const _rate = 500;
  const _wallet = network == "ganache" ? accounts[1]: "0x9B0090Cbe7b3C7b690cAe500505a197EfE00B3a3";
  const _token = deployedToken.address;
  const _cap = bnb(2);
 const _openingTime = latestTime + duration.minutes(1);
  const _closingTime = _openingTime + duration.hours(2);
 const _goal = bnb(1);

console.log(`Token: ${_token}\nCap: ${_cap}\nGoal:${_goal}`)
  console.log("Deploying LARTokenCrowdsale.......................................................")

  await deployer.deploy(
    LARTokenCrowdsale,
    _rate,
    _wallet,
    _token,
    _cap,
    _openingTime,
    _closingTime,
    _goal
 );
 
 console.log("LARTokenCrowdsale deployed.......................................................")

 const deployedCrowdsale = await LARTokenCrowdsale.deployed();
 
   console.log("Address of the deployed crowdsale: ", deployedCrowdsale.address)
  /*
 Before deploying, pause the token and transfer ownership to token address 
 */

  await deployedToken.pause();
 await deployedToken.transferOwnership(deployedCrowdsale.address);
 

  return true;
};
