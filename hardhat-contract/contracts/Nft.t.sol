// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import { NFT } from "./Nft.sol";
import { Test } from "forge-std/Test.sol";

// Solidity tests are compatible with foundry, so they
// use the same syntax and offer the same functionality.

contract NftTest is Test {
  NFT nft;
                           
  function setUp() public {
    nft = new NFT();
  }
  
  function test_InitialValue() public view {
    string memory symbol = nft.symbol();
    require(symbol == "PoP", "Symbol should be PoP");
  }
    
  
}
