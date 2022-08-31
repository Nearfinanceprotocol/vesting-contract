// this script would call the make deposit function
import {ethers} from "hardhat";

// ================================ NOTE ==================================
// Approval must be done before this function is ran
// ========================================================================
async function main() {
    const VESTING_CONTRACT = ""
    const NRF_CONTRACT_ADDRESS = "0x29Dd407114Ff727712732f8B6e7b605e68Ef18E5"
    const Vesting = await ethers.getContractFactory("Vesting");
    const vesting = await Vesting.attach(VESTING_CONTRACT);
    const Token = await ethers.getContractFactory("TestToken1");
    const token = Token.attach(NRF_CONTRACT_ADDRESS)


    // Approving
    token.approve(VESTING_CONTRACT, ethers.utils.parseEther("50000"));
    const res = await vesting.makeVest(ethers.utils.parseEther("50000"));
    
    console.log(res);
  }
  
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  