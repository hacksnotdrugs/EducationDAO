const { ethers } = require("hardhat");

let Dao, DaoContract;
let admin, member1, member2, member3, instructor1, instructor2;
const MEMBER_FEE = 1000;

const main = async () => {
  Dao = await ethers.getContractFactory("EducationDAO");
  [admin, member1, member2, member3, instructor1, instructor2] = await ethers.getSigners();

  DaoContract = await Dao.deploy(MEMBER_FEE);
  await DaoContract.deployed();

  console.log(`Contract deployed to: ${DaoContract.address}`);

  // Make everyone join the DAO
  console.log(`Waiting for people to join`)
  await DaoContract.connect(member1).joinDAO({value: MEMBER_FEE});
  await DaoContract.connect(member2).joinDAO({value: MEMBER_FEE});
  await DaoContract.connect(member3).joinDAO({value: MEMBER_FEE});

  console.log('People have joined the DAO! Now creating Training Proposals');

  // Create 3 proposals, only requiring 1 vote to pass 
  await DaoContract.connect(member1).createProposal("Proposal 1", "", 100, 1, 15);
  await DaoContract.connect(member2).createProposal("Proposal 2", "", 100, 1, 15);
  await DaoContract.connect(member3).createProposal("Proposal 3", "", 100, 1, 15);
  
  // GET PROPOSALS
  console.log("Fetching all proposals: ")
  const proposals = await DaoContract.getAllProposals();
  console.log(proposals);

  console.log("Members will now vote for proposals")
  // Get people to vote for the proposals, causing contract to create a class
  await DaoContract.connect(member2).vote(0); 
  await DaoContract.connect(member3).vote(1); 
  await DaoContract.connect(member1).vote(2); 
  
  console.log("Members will now join classes")
  // Get people to join classes
  await DaoContract.connect(member1).joinClass(1,{value:1000});
  await DaoContract.connect(member1).joinClass(2,{value:1000});
  await DaoContract.connect(member1).joinClass(3,{value:1000});
  await DaoContract.connect(member2).joinClass(1,{value:1000});
  await DaoContract.connect(member2).joinClass(2,{value:1000});
  await DaoContract.connect(member2).joinClass(3,{value:1000});
  await DaoContract.connect(member3).joinClass(1,{value:1000});
  await DaoContract.connect(member3).joinClass(2,{value:1000});
  await DaoContract.connect(member3).joinClass(3,{value:1000});

  // GET CLASSES
  console.log("Fetching all classes: ")
  const classes = await DaoContract.getAllClasses(); 
  console.log(classes);

  // GET CLASSES FOR EACH MEMBER
  console.log("Member 1 classes:")
  const memberOneClasses = await DaoContract.getClassesForStudent(member1.address);
  console.log(memberOneClasses);

}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

runMain();