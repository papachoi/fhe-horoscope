// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";

interface IDecryptionOracle {
    function requestDecryption(bytes32[] calldata handles, address target, bytes4 cb) external returns (uint256);
}

contract PrivateHoroscopeFHE {
    IDecryptionOracle public oracle;

    event Predicted(uint256 reqId);
    event Revealed(uint256 value, bytes sigSummary);

    function setDecryptionOracle(address a) external {
        oracle = IDecryptionOracle(a);
    }

    function predictFromEncrypted(
        externalEuint64 extDob, bytes calldata attDob,
        externalEuint64 extColor, bytes calldata attColor
    ) external {
        euint64 dob   = FHE.fromExternal(extDob, attDob);
        euint64 color = FHE.fromExternal(extColor, attColor);

        euint64 sum   = FHE.add(dob, color);
        euint64 hundred = FHE.asEuint64(100);
        euint64 mod100  = FHE.rem(sum, hundred);
        euint64 one     = FHE.asEuint64(1);
        euint64 out     = FHE.add(mod100, one);

        bytes32 ;
        hs[0] = FHE.toBytes32(out);
        uint256 reqId = oracle.requestDecryption(hs, address(this), this.onDecrypted.selector);
        emit Predicted(reqId);
    }

    function onDecrypted(uint256 /*reqId*/, uint64 value, bytes[] calldata signatures) external {
        FHE.checkSignatures(0, signatures);
        emit Revealed(value, signatures.length > 0 ? signatures[0] : "");
    }
}
