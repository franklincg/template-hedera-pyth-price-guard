import { ethers } from "hardhat";

const PYTH_HEDERA_TESTNET = "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729";
const ETH_USD_FEED = "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace";
const MIN_PRICE = 500_00000000n;
const MAX_PRICE = 20_000_00000000n;
const MAX_AGE = 120;

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No Hedera Testnet signer configured. Set HEDERA_TESTNET_PRIVATE_KEY.");
  }

  const Guard = await ethers.getContractFactory("PythPriceGuard");
  const guard = await Guard.deploy(
    PYTH_HEDERA_TESTNET,
    ETH_USD_FEED,
    MIN_PRICE,
    MAX_PRICE,
    MAX_AGE,
  );

  const deploymentTx = guard.deploymentTransaction();
  if (!deploymentTx) throw new Error("Deployment transaction was not created.");

  await guard.waitForDeployment();

  const address = await guard.getAddress();
  const txHash = deploymentTx.hash;

  console.log("PythPriceGuard deployed");
  console.log("deployer:", deployer.address);
  console.log("contract:", address);
  console.log("transaction:", txHash);
  console.log("hashscan:", `https://hashscan.io/testnet/transaction/${txHash}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
