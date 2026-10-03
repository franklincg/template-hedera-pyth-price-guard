import { expect } from "chai";
import { ethers } from "hardhat";

describe("PythPriceGuard", function () {
  const feedId = "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace";
  const minPrice = 1_000_00000000n;
  const maxPrice = 10_000_00000000n;

  async function fixture() {
    const MockPyth = await ethers.getContractFactory("MockPyth");
    const mock = await MockPyth.deploy(120, 1);
    await mock.waitForDeployment();

    const Guard = await ethers.getContractFactory("PythPriceGuard");
    const guard = await Guard.deploy(await mock.getAddress(), feedId, minPrice, maxPrice, 120);
    await guard.waitForDeployment();
    return { mock, guard };
  }

  async function priceData(mock: any, price: bigint) {
    const block = await ethers.provider.getBlock("latest");
    const now = BigInt(block!.timestamp);
    return mock.createPriceFeedUpdateData(feedId, price, 1_000_000, -8, price, 1_000_000, now, now - 1n);
  }

  it("accepts a fresh price inside the configured band", async function () {
    const { mock, guard } = await fixture();
    const data = await priceData(mock, 3_500_00000000n);
    await expect(guard.updateAndCheck([data], { value: 1 })).to.emit(guard, "PriceAccepted");
  });

  it("rejects a fresh price outside the configured band", async function () {
    const { mock, guard } = await fixture();
    const data = await priceData(mock, 500_00000000n);
    await expect(guard.updateAndCheck([data], { value: 1 })).to.be.revertedWithCustomError(guard, "PriceOutOfBounds");
  });

  it("exposes the configured feed and limits", async function () {
    const { guard } = await fixture();
    expect(await guard.priceFeedId()).to.equal(feedId);
    expect(await guard.minPrice()).to.equal(minPrice);
    expect(await guard.maxPrice()).to.equal(maxPrice);
    expect(await guard.maxAge()).to.equal(120);
  });
});
