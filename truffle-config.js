require("babel-register");
require("babel-polyfill");
require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("./keys.json")
const fs = require("fs");
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },

    // ganache: {
    //   host: "127.0.0.1",
    //   port: 8545,
    //   network_id: "1337", // eslint-disable-line camelcase
    // },

    // Useful for private networks
    testnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://data-seed-prebsc-1-s1.binance.org:8545`
        ),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 4500000,
      gasPrice: 10000000000,
    },

    ropsten: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: keys.MNEMONICS,
          },
          providerOrUrl: `https://ropsten.infura.io/v3/${keys.INFURA_PROJECT_ID}`,
          addressIndex: 0
        }),
      network_id: 3,
      gas: 5500000, // Gas Limit, How much gas we are willing to spent
      gasPrice: 20000000000, // how much we are willing to spent for unit of gas
      confirmations: 2, // number of blocks to wait between deployment
      timeoutBlocks: 200, // number of blocks before deployment times out
      networkCheckTimeoutnetworkCheckTimeout: 10000,
      skipDryRun: true,

    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.5", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: 'constantinople',
      
      //  evmVersion: "byzantium"
      }
    },
  },
};

// truffle deploy --network bscTestnet --reset --compile-none
// truffle deploy --network ganache --reset
// truffle migrate --network testnet --reset -f 2 --to 2 --compile-none
// truffle migrate --reset -f 2 --to 2 --compile-none
// truffle migrate --network ropsten --reset
