import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";


describe("Vesting", function () {

  async function deployVestingContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Vesting = await ethers.getContractFactory("Vesting");
    const Token = await ethers.getContractFactory("TestToken1");
    const token = await Token.deploy();
    await token.deployed();
    const vesting = await Vesting.deploy(token.address);
    await vesting.deployed();

    return { vesting, Vesting, owner, otherAccount, token };
  }

  describe("Contract", function () {
    it("Checking if the manager was set", async function () {
      const { vesting, owner } = await loadFixture(deployVestingContract);

      expect(await vesting.manager()).to.equal(owner.address);
    });
  });

  describe("makeDeposit", function () {
    it("Should revert because the person call is not a admin", async function () {
      const { vesting, otherAccount } = await loadFixture(deployVestingContract);

      const vest = vesting.connect(otherAccount);

      await expect(vest.makeVest(ethers.utils.parseEther("1"))).to.be.revertedWithCustomError(vest, "NotAdmin");
    });
    it("Should pass if vesting is successful", async function () {
      const { vesting, otherAccount, token } = await loadFixture(deployVestingContract);

      // approving the contract to spend ERC20 tokens
      await token.approve(vesting.address, ethers.utils.parseEther("50000"));

      // vesting
      await vesting.makeVest(ethers.utils.parseEther("50000"));


      await expect(await vesting.hasVested()).to.equal(true);
    });
  });

  describe("monthlyDeposit", function () {
    it("Should revert because the person call is not a admin", async function () {
      const { vesting, otherAccount } = await loadFixture(deployVestingContract);

      const vest = vesting.connect(otherAccount);

      await expect(vest.monthlyWithdrawal(otherAccount.address)).to.be.revertedWithCustomError(vest, "NotAdmin");
    });
    it("Should fail because withdrawal time has not been met", async function () {
      const { vesting, otherAccount, token } = await loadFixture(deployVestingContract);

      // approving the contract to spend ERC20 tokens
      await token.approve(vesting.address, ethers.utils.parseEther("50000"));

      // vesting
      await vesting.makeVest(ethers.utils.parseEther("50000"));


      await expect(vesting.monthlyWithdrawal(otherAccount.address)).to.be.revertedWithCustomError(vesting, "WithdrawalTime");
    });
    it("Should pass, token transfered, and nonce increased", async function () {
      const { vesting, otherAccount, token } = await loadFixture(deployVestingContract);

      // approving the contract to spend ERC20 tokens
      await token.approve(vesting.address, ethers.utils.parseEther("50000"));

      // vesting
      await vesting.makeVest(ethers.utils.parseEther("50000"));

      // manipluating the blocktime to be higher than 1 month in the future 
      const current_time = await time.latest();
      await time.increaseTo(current_time + 2592000);
      const cc = await time.latest();

      console.log(current_time);
      console.log(cc);
      
      

      await vesting.monthlyWithdrawal(otherAccount.address);

      let bal = await token.balanceOf(otherAccount.address);

      await expect(bal).to.equal("2083500000000000000000");
    });
  });

  describe("moveGenericToken", function () {
    it("Should revert if the contract address of the vested token was passed", async function () {
      const { vesting, token, otherAccount } = await loadFixture(deployVestingContract);

      await expect(vesting.movingGeneric(otherAccount.address, token.address, ethers.utils.parseEther("1"))).to.be.revertedWithCustomError(vesting, "WrongAction");
    });
  });
});
