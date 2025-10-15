// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract HoroscopeCoordinator {
    struct Request {
        bytes encryptedBD;
        uint256 currentTimestamp;
        uint256 blockNumber;
        address requester;
        bytes encryptedResult;
        bool verified;
    }

    mapping(uint256 => Request) public requests;
    uint256 public requestCount;

    event ComputeRequested(uint256 id, address requester, bytes encryptedBD, uint256 timestamp, uint256 blockNum);
    event ResultVerified(uint256 id, bytes encryptedResult);

    function submitRequest(bytes memory _encryptedBD, uint256 _timestamp, uint256 _blockNum) external {
        uint256 id = requestCount++;
        requests[id] = Request({
            encryptedBD: _encryptedBD,
            currentTimestamp: _timestamp,
            blockNumber: _blockNum,
            requester: msg.sender,
            encryptedResult: "",
            verified: false
        });
        emit ComputeRequested(id, msg.sender, _encryptedBD, _timestamp, _blockNum);
    }

    function submitResult(uint256 _id, bytes memory _encryptedResult, bytes32 _proof) external {
        Request storage req = requests[_id];
        require(req.requester != address(0), "Invalid request");
        require(!req.verified, "Already verified");

        bytes32 expectedProof = keccak256(
            abi.encodePacked(req.encryptedBD, req.currentTimestamp, req.blockNumber, _encryptedResult)
        );
        require(_proof == expectedProof, "Invalid proof");

        req.encryptedResult = _encryptedResult;
        req.verified = true;
        emit ResultVerified(_id, _encryptedResult);
    }

    function getEncryptedResult(uint256 _id) external view returns (bytes memory) {
        require(requests[_id].requester == msg.sender, "Not your request");
        return requests[_id].encryptedResult;
    }
}
