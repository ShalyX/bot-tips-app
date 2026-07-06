import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import "dotenv/config";

const privateKey = process.env["PRIVATE_KEY"];

/** @type import('hardhat/config').HardhatUserConfig */
export default {
  plugins: [hardhatEthers],
  solidity: "0.8.24",
  networks: {
    botchain_testnet: {
      type: "http",
      url: "https://rpc.bohr.life",
      chainId: 968,
      accounts: privateKey ? [privateKey] : [],
    }
  }
};
