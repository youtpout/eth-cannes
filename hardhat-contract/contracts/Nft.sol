// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {HonkVerifier} from "./Verifier.sol";

contract NFT is ERC721 {
    uint256 private _nextTokenId;
    HonkVerifier public verifier;

    constructor(address _verifier) ERC721("Proof Of Participation", "PoP") {
        verifier = HonkVerifier(_verifier);
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://gateway.lighthouse.storage/ipfs/bafkreifbms4pcv525ax5ihmmiqo7ttlwepemlldfpcdb7pskcr6egvymmm";
    }

    function safeMint(
        address to,
        bytes calldata proof
    ) public returns (uint256) {
        bytes32[] memory publicInputs = new bytes32[](0);
        require(verifier.verify(proof, publicInputs), "Invalid proof");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }
}
