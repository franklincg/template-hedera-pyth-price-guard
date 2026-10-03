import { ethers } from "hardhat";

const HEDERA_TESTNET_PYTH = "0xA2aa501b19aff244D90cc15a4Cf739D2725B5729";
const BTC_USD_FEED = "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";

async function main() {
  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No funded Hedera Testnet signer is configured.");
  }

  const factory = await ethers.getContractFactory("PythPriceGuard");
  const guard = await factory.deploy(
    HEDERA_TESTNET_PYTH,
    BTC_USD_FEED,
    1_000_000_000_000n,
    50_000_000_000_000n,
    120,
  );

  const deploymentTx = guard.deploymentTransaction();
  if (!deploymentTx) {
    throw new Error("Deployment transaction was not created.");
  }

  const receipt = await deploymentTx.wait();
  if (!receipt) {
    throw new Error("Deployment transaction was not confirmed.");
  }

  console.log("Contract:", await guard.getAddress());
  console.log("Transaction:", receipt.hash);
  console.log("HashScan:", "https://hashscan.io/testnet/transaction/" + receipt.hash);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
