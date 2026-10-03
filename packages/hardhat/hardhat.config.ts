import * as dotenv from "dotenv";
dotenv.config();

import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import type { HardhatUserConfig } from "hardhat/config";

const accounts = process.env.HEDERA_TESTNET_PRIVATE_KEY
  ? [process.env.HEDERA_TESTNET_PRIVATE_KEY]
  : [];

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hederaTestnet: {
      url: process.env.HEDERA_RPC_URL ?? "https://testnet.hashio.io/api",
      chainId: 296,
      accounts,
    },
  },
};

export default config;
