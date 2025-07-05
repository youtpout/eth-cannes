// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    uint256 private _nextTokenId;

    constructor()
        ERC721("Proof Of Participation", "PoP")
    {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://gateway.lighthouse.storage/ipfs/bafkreifbms4pcv525ax5ihmmiqo7ttlwepemlldfpcdb7pskcr6egvymmm";
    }

    function safeMint(address to) public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }
}
