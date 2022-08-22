require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs");
const secrets = JSON.parse(fs.readFileSync('.secrets.json').toString().trim());


const ALCHEMY_API_KEY = secrets.alchemy;

const GOERLI_PRIVATE_KEY = secrets.privatekeys[0];

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    }
  }
};
