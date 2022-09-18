// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
const fs = require("fs");

const CONTRACT_NAME = "EducationDAO";
const MEMBER_FEE = hre.ethers.utils.parseEther("0.1");

async function main() {
    
    const [deployer] = await hre.ethers.getSigners();
  
    const EducationDAO = await hre.ethers.getContractFactory("EducationDAO");
    const educationDAO = await EducationDAO.deploy(MEMBER_FEE);
  
    await educationDAO.deployed();
    console.log("Contract address:", educationDAO.address);
  
    saveFrontendFiles(educationDAO);
  }
  
  function saveFrontendFiles(contract) {
    const fs = require("fs");
    const contractsDir = __dirname + "/../frontend/src/abis";
  
    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }
  
    fs.writeFileSync(
      contractsDir + "/contract-address.json",
      JSON.stringify({ DAO: contract.address }, undefined, 2)
    );
  
    const DAOArtifact = hre.artifacts.readArtifactSync("EducationDAO");
  
    fs.writeFileSync(
      contractsDir + "/EducationDAO.json",
      JSON.stringify(DAOArtifact, null, 2)
    );
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
  