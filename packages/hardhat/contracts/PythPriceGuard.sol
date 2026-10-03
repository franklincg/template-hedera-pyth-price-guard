// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IPyth} from "./IPyth.sol";

/// @title PythPriceGuard
/// @notice A reusable price-band circuit breaker for Hedera dApps using Pyth.
contract PythPriceGuard {
    IPyth public immutable pyth;
    bytes32 public immutable priceFeedId;
    int64 public immutable minPrice;
    int64 public immutable maxPrice;
    uint64 public immutable maxAge;

    error InvalidConfiguration();
    error InsufficientUpdateFee(uint256 required, uint256 supplied);
    error PriceOutOfBounds(int64 price, int64 minAllowed, int64 maxAllowed);
    error RefundFailed();

    event PriceAccepted(int64 price, int32 expo, uint256 publishTime);

    constructor(
        address pyth_,
        bytes32 priceFeedId_,
        int64 minPrice_,
        int64 maxPrice_,
        uint64 maxAge_
    ) {
        if (pyth_ == address(0) || minPrice_ >= maxPrice_ || maxAge_ == 0) {
            revert InvalidConfiguration();
        }

        pyth = IPyth(pyth_);
        priceFeedId = priceFeedId_;
        minPrice = minPrice_;
        maxPrice = maxPrice_;
        maxAge = maxAge_;
    }

    function read() public view returns (IPyth.Price memory) {
        return pyth.getPriceNoOlderThan(priceFeedId, maxAge);
    }

    function updateAndCheck(bytes[] calldata priceUpdate)
        external
        payable
        returns (int64 price, int32 expo, uint256 publishTime)
    {
        uint256 updateFee = pyth.getUpdateFee(priceUpdate);
        if (msg.value < updateFee) {
            revert InsufficientUpdateFee(updateFee, msg.value);
        }

        pyth.updatePriceFeeds{value: updateFee}(priceUpdate);

        IPyth.Price memory current = read();
        if (current.price < minPrice || current.price > maxPrice) {
            revert PriceOutOfBounds(current.price, minPrice, maxPrice);
        }

        uint256 refund = msg.value - updateFee;
        if (refund != 0) {
            (bool ok,) = msg.sender.call{value: refund}("");
            if (!ok) revert RefundFailed();
        }

        emit PriceAccepted(current.price, current.expo, current.publishTime);
        return (current.price, current.expo, current.publishTime);
    }
}
