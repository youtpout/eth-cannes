import { expect } from "chai";
import { network } from "hardhat";


const { ethers } = await network.connect();

describe("Verifier", function () {
  it("Should deploy the contracts", async function () {
    const verifier = await ethers.deployContract("HonkVerifier");
    const addressVerifier = await verifier.getAddress();
    const nft = await ethers.deployContract("NFT", [addressVerifier]);

    const verifierAdr = await nft.verifier();
    // Hardhat 3 comes with chai assertions to work with ethers, like `emit` here
    await expect(verifierAdr).to.equal(addressVerifier);
  });


});
