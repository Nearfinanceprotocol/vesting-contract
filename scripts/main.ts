// this script would call the make deposit function
import {ethers} from "hardhat";

// ================================ NOTE ==================================
// Approval must be done before this function is ran
// ========================================================================
async function main() {
    const VESTING_CONTRACT = ""
    const Vesting = await ethers.getContractFactory("Vesting");
    const vesting = await Vesting.attach(VESTING_CONTRACT);
  
    const res = await vesting.makeVest(ethers.utils.parseEther("50000"));
    
    console.log(res);
  }
  
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  