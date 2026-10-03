import { expect } from "chai";
import { ethers } from "hardhat";

describe("PythPriceGuard", function () {
  const feedId = "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";
  const minPrice = 1_000_000_000_000n;
  const maxPrice = 50_000_000_000_000n;

  async function deployFixture(updateFee = 0n) {
    const [owner] = await ethers.getSigners();

    const mockFactory = await ethers.getContractFactory("MockPyth");
    const mock = await mockFactory.deploy(6_000_000_000_000n, -8, updateFee);

    const guardFactory = await ethers.getContractFactory("PythPriceGuard");
    const guard = await guardFactory.deploy(
      await mock.getAddress(),
      feedId,
      minPrice,
      maxPrice,
      120,
    );

    return { owner, mock, guard };
  }

  it("accepts a fresh in-range Pyth price", async function () {
    const { guard } = await deployFixture();
    await expect(guard.updateAndCheck([])).to.emit(guard, "PriceAccepted");
  });

  it("rejects an out-of-range price", async function () {
    const { mock, guard } = await deployFixture();
    await mock.setPrice(500_000_000_000n);

    await expect(guard.updateAndCheck([]))
      .to.be.revertedWithCustomError(guard, "PriceOutOfBounds")
      .withArgs(500_000_000_000n, minPrice, maxPrice);
  });

  it("requires the quoted Pyth update fee", async function () {
    const { guard } = await deployFixture(10n);

    await expect(guard.updateAndCheck([], { value: 9n }))
      .to.be.revertedWithCustomError(guard, "InsufficientUpdateFee")
      .withArgs(10n, 9n);
  });

  it("refunds value above the update fee", async function () {
    const { owner, guard } = await deployFixture(10n);
    const before = await ethers.provider.getBalance(await guard.getAddress());

    await guard.connect(owner).updateAndCheck([], { value: 100n });

    const after = await ethers.provider.getBalance(await guard.getAddress());
    expect(after - before).to.equal(0n);
  });

  it("stores immutable feed configuration", async function () {
    const { guard } = await deployFixture();
    expect(await guard.priceFeedId()).to.equal(feedId);
    expect(await guard.minPrice()).to.equal(minPrice);
    expect(await guard.maxPrice()).to.equal(maxPrice);
    expect(await guard.maxAge()).to.equal(120n);
  });
});
