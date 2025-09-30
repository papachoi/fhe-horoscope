// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Private FHE Horoscope (prototype - FHE-ready shape)
/// @notice Today we "encrypt" by hashing; swap to real FHEVM encrypted types + ops later.
contract FHEHoroscope {
    /// Placeholder type to keep the FHEVM-ready shape (not used in this version).
    type FHEVector is bytes32;

    event Predicted(address indexed user, uint256 index1to100, string message);

    /// @notice Predict using DOB (yyyymmdd) and favorite color (e.g., "#FF5733")
    /// @dev Returns (index 1..100, fortune message). Uses block.timestamp as "current date".
    function predictFromInputs(uint32 dobYmd, string calldata favoriteColor)
        external
        returns (uint256 index1to100, string memory message)
    {
        bytes32 dobHash = keccak256(abi.encodePacked(dobYmd));
        bytes32 colorHash = keccak256(bytes(favoriteColor));

        bytes32 combined = keccak256(
            abi.encodePacked(dobHash, colorHash, msg.sender, block.timestamp)
        );

        index1to100 = (uint256(combined) % 100) + 1;
        message = _fortuneFor(index1to100);

        emit Predicted(msg.sender, index1to100, message);
    }

    function _fortuneFor(uint256 idx) internal pure returns (string memory) {
        unchecked {
            uint256 k = (idx - 1) % 10;
            if (k == 0) return "win";
            if (k == 1) return "luck";
            if (k == 2) return "love";
            if (k == 3) return "wealth";
            if (k == 4) return "health";
            if (k == 5) return "learn";
            if (k == 6) return "travel";
            if (k == 7) return "create";
            if (k == 8) return "connect";
            return "focus"; // k == 9
        }
    }

    function makeVec(bytes32 x) external pure returns (FHEVector) {
        return FHEVector.wrap(x);
    }

    function predictHoroscope(
        FHEVector dob,
        FHEVector color,
        FHEVector /* licenseCode */
    ) external returns (uint256) {
        bytes32 combined = keccak256(
            abi.encodePacked(FHEVector.unwrap(dob), FHEVector.unwrap(color), msg.sender, block.timestamp)
        );
        uint256 idx = (uint256(combined) % 100) + 1;
        string memory message = _fortuneFor(idx);
        emit Predicted(msg.sender, idx, message);
        return idx;
    }
}
