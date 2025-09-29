const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FHEHoroscope (Day 35)", () => {
  it("maps inputs to a [1..100] prediction", async () => {
    const [user] = await ethers.getSigners();
    const F = await ethers.getContractFactory("FHEHoroscope");
    const c = await F.deploy();
    await c.waitForDeployment();

    // pseudo-"encrypted" bytes32 (hash the raw inputs)
    const dob = ethers.keccak256(ethers.toUtf8Bytes("19800101"));
    const color = ethers.keccak256(ethers.toUtf8Bytes("#FF5733"));
    const lic = ethers.keccak256(ethers.toUtf8Bytes("123456"));

    // Wrap as FHEVector (bytes32) via helper
    const dobV = await c.makeVec(dob);
    const colorV = await c.makeVec(color);
    const licV = await c.makeVec(lic);

    const tx = await c.predictHoroscope(dobV, colorV, licV);
    const rc = await tx.wait();
    const ret = rc.logs?.[0]?.args?.[1] ?? await c.predictHoroscope.staticCall(dobV, colorV, licV);

    const prediction = BigInt(ret);
    expect(prediction).to.be.gte(1n).and.lte(100n);
  });
});
