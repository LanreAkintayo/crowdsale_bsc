const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
 console.log("Deploying Migrations.......................................................")

  deployer.deploy(Migrations);

 console.log("Migrations deployed.......................................................")

};
