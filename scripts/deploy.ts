import { ethers } from "hardhat";

async function main() {
  const NRF_TOKEN_ADDRESS = "0x29Dd407114Ff727712732f8B6e7b605e68Ef18E5"
  const Timelock = await ethers.getContractFactory("Vesting");
  const timelock = await Timelock.deploy(NRF_TOKEN_ADDRESS);

  await timelock.deployed();
  console.log(`Address: ${timelock.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
