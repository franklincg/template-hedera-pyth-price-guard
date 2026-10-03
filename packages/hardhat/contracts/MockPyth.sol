// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {IPyth} from "./IPyth.sol";

contract MockPyth is IPyth {
    Price private currentPrice;
    uint256 private updateFee;

    constructor(int64 initialPrice, int32 expo, uint256 initialFee) {
        currentPrice = Price({
            price: initialPrice,
            conf: 1,
            expo: expo,
            publishTime: block.timestamp
        });
        updateFee = initialFee;
    }

    function setPrice(int64 value) external {
        currentPrice.price = value;
        currentPrice.publishTime = block.timestamp;
    }

    function setUpdateFee(uint256 value) external {
        updateFee = value;
    }

    function getUpdateFee(bytes[] calldata) external view returns (uint256) {
        return updateFee;
    }

    function updatePriceFeeds(bytes[] calldata) external payable {
        require(msg.value >= updateFee, "fee");
    }

    function getPriceNoOlderThan(bytes32, uint256 age) external view returns (Price memory) {
        require(block.timestamp - currentPrice.publishTime <= age, "stale");
        return currentPrice;
    }
}
