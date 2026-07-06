// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CreatorRegistry {
    struct Creator {
        address wallet;
        string username;
        string bio;
        string avatarUrl;
        uint256 totalTipsReceived;
        bool isRegistered;
        string campaignTitle;
        uint256 campaignTarget;
    }

    struct Tip {
        address from;
        address to;
        uint256 timestamp;
        string name;
        string message;
        uint256 amount;
    }

    mapping(address => Creator) public creators;
    mapping(address => Tip[]) public creatorTips;
    address[] public allCreators;

    event CreatorRegistered(address indexed wallet, string username);
    event NewTip(
        address indexed from,
        address indexed to,
        uint256 timestamp,
        string name,
        string message,
        uint256 amount
    );

    function registerCreator(string memory _username, string memory _bio, string memory _avatarUrl) public {
        require(!creators[msg.sender].isRegistered, "Creator already registered");
        require(bytes(_username).length > 0, "Username is required");
        
        creators[msg.sender] = Creator({
            wallet: msg.sender,
            username: _username,
            bio: _bio,
            avatarUrl: _avatarUrl,
            totalTipsReceived: 0,
            isRegistered: true,
            campaignTitle: "",
            campaignTarget: 0
        });
        
        allCreators.push(msg.sender);
        
        emit CreatorRegistered(msg.sender, _username);
    }

    function setCampaign(string memory _title, uint256 _target) public {
        require(creators[msg.sender].isRegistered, "Creator not registered");
        require(bytes(_title).length > 0, "Campaign title is required");
        require(_target > 0, "Campaign target must be greater than 0");
        
        creators[msg.sender].campaignTitle = _title;
        creators[msg.sender].campaignTarget = _target;
    }

    function sendTip(address _creator, string memory _name, string memory _message) public payable {
        require(msg.value > 0, "Tip amount must be greater than 0");
        require(creators[_creator].isRegistered, "Creator not registered");
        
        // Instant Settlement: forward funds directly to creator
        (bool success, ) = payable(_creator).call{value: msg.value}("");
        require(success, "Transfer failed");
        
        creators[_creator].totalTipsReceived += msg.value;
        
        creatorTips[_creator].push(Tip({
            from: msg.sender,
            to: _creator,
            timestamp: block.timestamp,
            name: _name,
            message: _message,
            amount: msg.value
        }));
        
        emit NewTip(msg.sender, _creator, block.timestamp, _name, _message, msg.value);
    }

    function getCreatorTips(address _creator) public view returns (Tip[] memory) {
        return creatorTips[_creator];
    }

    function getCreator(address _creator) public view returns (Creator memory) {
        return creators[_creator];
    }
    
    function getAllCreators() public view returns (Creator[] memory) {
        Creator[] memory _allCreators = new Creator[](allCreators.length);
        for (uint i = 0; i < allCreators.length; i++) {
            _allCreators[i] = creators[allCreators[i]];
        }
        return _allCreators;
    }
}
