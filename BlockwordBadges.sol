// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BlockwordBadges is ERC721, Ownable {
    uint256 private _tokenIdCounter;
    
    // Badge types
    enum BadgeType {
        FIRST_WORD,      // 0 - Spell your first word
        TEN_WORDS,       // 1 - Complete 10 words
        SPEED_DEMON,     // 2 - Spell 5 words in 1 minute
        PERFECT_GAME,    // 3 - 10/10 words correct
        VOCAB_BUILDER    // 4 - Learn 50 unique words
    }
    
    // Mapping from token ID to badge type
    mapping(uint256 => BadgeType) public tokenBadgeType;
    
    // Mapping from address to badge types earned
    mapping(address => mapping(BadgeType => bool)) public hasBadge;
    
    // Badge metadata URIs
    mapping(BadgeType => string) public badgeURIs;
    
    constructor() ERC721("Blocword Badges", "BADGE") Ownable(msg.sender) {
        // Set badge metadata URIs (IPFS links)
        badgeURIs[BadgeType.FIRST_WORD] = "ipfs://QmFirstWord";
        badgeURIs[BadgeType.TEN_WORDS] = "ipfs://QmTenWords";
        badgeURIs[BadgeType.SPEED_DEMON] = "ipfs://QmSpeedDemon";
        badgeURIs[BadgeType.PERFECT_GAME] = "ipfs://QmPerfectGame";
        badgeURIs[BadgeType.VOCAB_BUILDER] = "ipfs://QmVocabBuilder";
    }
    
    function mintBadge(address to, BadgeType badgeType) public onlyOwner {
        require(!hasBadge[to][badgeType], "Badge already earned");
        
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        
        tokenBadgeType[tokenId] = badgeType;
        hasBadge[to][badgeType] = true;
    }
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return badgeURIs[tokenBadgeType[tokenId]];
    }
    
    function updateBadgeURI(BadgeType badgeType, string memory newURI) public onlyOwner {
        badgeURIs[badgeType] = newURI;
    }
}
