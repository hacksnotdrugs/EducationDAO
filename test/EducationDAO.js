const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EducationDAO Contract", () => {
    let Dao, DaoContract;
    let RECIPIENT_ADDRESS;
    let admin, member1, member2, member3, instructor1;
    const MEMBER_FEE = 1000;
  
    beforeEach(async () => {
      Dao = await ethers.getContractFactory("EducationDAO");
      [admin, member1, member2, member3, instructor1] = await ethers.getSigners();
      DaoContract = await Dao.deploy(MEMBER_FEE);
      await DaoContract.deployed();
  
    });


  // User Joins
    describe("Testing joinDAO", () => {
        it("Should not allow user to join - value sent too low", async () => {
            let notEnough = MEMBER_FEE-1;
            await expect(DaoContract.connect(member1).joinDAO({value: notEnough})).to.be.revertedWith("Not enough ETH to join the DAO");

        });
        it("Should not allow user to join - user already a member", async () => {
            await DaoContract.connect(member1).joinDAO({value: MEMBER_FEE});
            await expect(DaoContract.connect(member1).joinDAO({value: MEMBER_FEE})).to.be.revertedWith("Caller is already a member!");

        });
        it("Should allow user to join - one user", async () => {
            
            await DaoContract.connect(member1).joinDAO({value: MEMBER_FEE});
            let memberCountAfter = await DaoContract.memberCount();
            expect(memberCountAfter).to.equal(1);
            let contractBalanceAfter = await ethers.provider.getBalance(DaoContract.address);
            expect(contractBalanceAfter).to.equal(MEMBER_FEE);

        });
        it("Should allow user to join - Multiple users", async () => {
            
            await DaoContract.connect(member1).joinDAO({value: MEMBER_FEE});
            let memberCountAfter1 = await DaoContract.memberCount();
            await DaoContract.connect(member2).joinDAO({value: MEMBER_FEE});
            let memberCountAfter2 = await DaoContract.memberCount();
            expect(memberCountAfter2).to.equal(ethers.BigNumber.from(memberCountAfter1).add(ethers.BigNumber.from(1)));
            await DaoContract.connect(member3).joinDAO({value: MEMBER_FEE});
            let memberCountAfter3 = await DaoContract.memberCount();
            expect(memberCountAfter3).to.equal(ethers.BigNumber.from(memberCountAfter2).add(ethers.BigNumber.from(1)));
            expect(memberCountAfter3).to.equal(3);
            let contractBalanceAfter = await ethers.provider.getBalance(DaoContract.address);
            expect(contractBalanceAfter).to.equal(ethers.BigNumber.from(memberCountAfter3).mul(ethers.BigNumber.from(MEMBER_FEE)));

        });
    });
    // createClass(string className, address payable _instructor, uint256 _studentLimit, uint256 _price)
    describe("Testing createClass", () => {
        
    });
});