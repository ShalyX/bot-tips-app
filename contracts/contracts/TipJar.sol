// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract TipJar {
    address payable public owner;

    event NewTip(
        address indexed from,
        uint256 timestamp,
        string name,
        string message,
        uint256 amount
    );

    struct Tip {
        address from;
        uint256 timestamp;
        string name;
        string message;
        uint256 amount;
    }

    Tip[] public tips;

    constructor() {
        owner = payable(msg.sender);
    }

    function getTips() public view returns (Tip[] memory) {
        return tips;
    }

    function sendTip(string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Tip amount must be greater than 0");
        
        tips.push(Tip(
            msg.sender,
            block.timestamp,
            _name,
            _message,
            msg.value
        ));

        emit NewTip(msg.sender, block.timestamp, _name, _message, msg.value);
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(address(this).balance > 0, "No balance to withdraw");
        owner.transfer(address(this).balance);
    }
}
