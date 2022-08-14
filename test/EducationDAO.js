const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EducationDAO Contract", () => {
    let Dao, DaoContract;
    let RECIPIENT_ADDRESS;
    let admin, member1, member2, member3, instructor1;
    const MEMBER_FEE = 1000;
    let MEMBER_ROLE, INSTRUCTOR_ROLE, STUDENT_ROLE, DEFAULT_ADMIN_ROLE = "";
    beforeEach(async () => {
      Dao = await ethers.getContractFactory("EducationDAO");
      [admin, member1, member2, member3, instructor1] = await ethers.getSigners();
      DaoContract = await Dao.deploy(MEMBER_FEE);
      await DaoContract.deployed();
      MEMBER_ROLE = await DaoContract.MEMBER_ROLE();
      INSTRUCTOR_ROLE = await DaoContract.INSTRUCTOR_ROLE();
      STUDENT_ROLE = await DaoContract.STUDENT_ROLE();
      DEFAULT_ADMIN_ROLE = await DaoContract.DEFAULT_ADMIN_ROLE();
      
  
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
            expect(await DaoContract.hasRole(MEMBER_ROLE, member1.address)).to.be.eq(true);

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
    
    describe("Testing startClass", () => {
        it("Should create class", async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 5, 15, 1000);
            expect(await DaoContract.classCount()).to.be.eq(1);
        });
        
        it("Should not allow user to start a Class - Not a MEMBER", async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 5, 15, 1000);
            await expect(DaoContract.connect(member2).startClass(1)).to.be.revertedWith(`AccessControl: account ${member2.address.toLowerCase()} is missing role ${MEMBER_ROLE}`);
    
        });
        it("Should not allow user to start a Class - Not the class instructor", async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 5, 15, 1000);
            await DaoContract.connect(member2).joinDAO({value: MEMBER_FEE});
            await expect(DaoContract.connect(member2).startClass(1)).to.be.revertedWith("Only the instructor can perform this activity");

        });
        it("Should not allow user to start a Class - Class has already started", async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 5, 15, 1000);
            await DaoContract.connect(instructor1).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(instructor1).startClass(1);
            await expect(DaoContract.connect(instructor1).startClass(1)).to.be.revertedWith("This class has already started");

        });
        it("Should not allow user to start a Class - Class has already ended", async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 5, 15, 1000);
            await DaoContract.connect(instructor1).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(instructor1).startClass(1);
            await DaoContract.connect(instructor1).endClass(1);
            await expect(DaoContract.connect(instructor1).startClass(1)).to.be.revertedWith("This class has already started");

        });
        it("Should not allow user to start a Class - Not enough students", async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 1, 15, 1000);
            await DaoContract.connect(instructor1).joinDAO({value: MEMBER_FEE});
            await expect(DaoContract.connect(instructor1).startClass(1)).to.be.revertedWith("Not enough students enrolled to start the class");

        });

        it("Should allow the instructor to start a Class ", async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 3, 15, 1000);
            await DaoContract.connect(instructor1).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(member2).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(member2).joinClass(1,{value:1000});
            await DaoContract.connect(member1).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(member1).joinClass(1,{value:1000});
            await DaoContract.connect(member3).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(member3).joinClass(1,{value:1000});
            //expect(await DaoContract.connect(instructor1).hasRole(MEMBER_ROLE, member2.address)).to.be.eq(true);
            await DaoContract.connect(instructor1).startClass(1);
            let classX = await DaoContract.getClass(1);
            expect(classX.started).to.be.eq(true);
            expect(await DaoContract.hasRole(INSTRUCTOR_ROLE, instructor1.address)).to.be.eq(true);
        });
    });

    describe("Testing EndClass", () => {
    
        
        it("Should not allow user to end a Class - Not a MEMBER", async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 5, 15, 1000);
            await expect(DaoContract.connect(member2).endClass(1)).to.be.revertedWith(`AccessControl: account ${member2.address.toLowerCase()} is missing role ${MEMBER_ROLE}`);
    
        });
        it("Should not allow user to end a Class - Not the class instructor", async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 5, 15, 1000);
            await DaoContract.connect(member2).joinDAO({value: MEMBER_FEE});
            await expect(DaoContract.connect(member2).endClass(1)).to.be.revertedWith("Only the instructor can perform this activity");

        });
        it("Should not allow user to end a Class - Class has not started", async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 5, 15, 1000);
            await DaoContract.connect(instructor1).joinDAO({value: MEMBER_FEE});
            await expect(DaoContract.connect(instructor1).endClass(1)).to.be.revertedWith("This class has not started");

        });
        it("Should not allow user to end a Class - Class has already ended", async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 5, 15, 1000);
            await DaoContract.connect(instructor1).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(instructor1).startClass(1);
            await DaoContract.connect(instructor1).endClass(1);
            await expect(DaoContract.connect(instructor1).endClass(1)).to.be.revertedWith("This class has already ended");

        });

        it("Should allow the instructor to end a Class ", async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 5, 15, 1000);
            await DaoContract.connect(instructor1).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(instructor1).startClass(1);
            await DaoContract.connect(instructor1).endClass(1);
            let classX = await DaoContract.getClass(1);
            expect(classX.ended).to.be.eq(true);
        });
    });

    describe("Testing joinClass", () => {
    
        beforeEach(async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 1, 2, 1000);
            await DaoContract.connect(instructor1).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(member1).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(member2).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(member1).joinClass(1,{value:1000});

        });
        it("Should not allow user to join a Class - Not a MEMBER", async () => {
            
            await expect(DaoContract.connect(member3).joinClass(1)).to.be.revertedWith(`AccessControl: account ${member3.address.toLowerCase()} is missing role ${MEMBER_ROLE}`);
    
        });
        it("Should not allow user to join a Class - class already started", async () => {
            await DaoContract.connect(instructor1).startClass(1);
            await expect(DaoContract.connect(member2).joinClass(1)).to.be.revertedWith("This class has already started");
    
        });
        it("Should not allow user to join a Class - Not enough ETH", async () => {
            
            await expect(DaoContract.connect(member2).joinClass(1, {value: 999})).to.be.revertedWith("Not enough ETH to join this class");
    
        });
        it("Should not allow user to join a Class - Class is full", async () => {
            
            DaoContract.connect(member2).joinClass(1, {value: 1000});
            await DaoContract.connect(member3).joinDAO({value: MEMBER_FEE});
            await expect(DaoContract.connect(member3).joinClass(1, {value: 1000})).to.be.revertedWith("Class is full");
    
        });
        it("Should not allow user to join a Class - Already enrolled", async () => {
            
            await expect(DaoContract.connect(member1).joinClass(1, {value: 1000})).to.be.revertedWith("You are already enrolled in this class");
    
        });
        it("Should allow user to join a Class - member is not student", async () => {
            
            await DaoContract.connect(member2).joinClass(1, {value: 1000});
            let classX =  await DaoContract.getClass(1);
            expect(classX.currentNumberOfStudents).to.eq(2);
            expect(await DaoContract.hasRole(STUDENT_ROLE, member2.address)).to.be.eq(true);
            expect(await DaoContract.getClassBalance(1)).to.eq(ethers.BigNumber.from(2000));
            expect(await DaoContract.isMemberEnrolledInClass(member2.address, 1)).to.eq(true);

    
        });
        it("Should allow user to join a Class - member already a student", async () => {
            await DaoContract.createClass("Class 2", instructor1.address, 1, 2, 1000);
            await DaoContract.connect(member1).joinClass(2, {value: 1000});
            let classX =  await DaoContract.getClass(2);
            expect(classX.currentNumberOfStudents).to.eq(1);
            expect(await DaoContract.hasRole(STUDENT_ROLE, member1.address)).to.be.eq(true);
            expect(await DaoContract.getClassBalance(1)).to.eq(ethers.BigNumber.from(1000));
            expect(await DaoContract.isMemberEnrolledInClass(member1.address, 1)).to.eq(true);
        });
    });

    describe("Testing withdraw from class", () => {
    
        beforeEach(async () => {
            await DaoContract.createClass("Class 1", instructor1.address, 1, 2, 1000);
            await DaoContract.createClass("Class 2", instructor1.address, 1, 2, 1000);
            await DaoContract.connect(instructor1).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(member1).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(member2).joinDAO({value: MEMBER_FEE});
            await DaoContract.connect(member1).joinClass(1,{value:1000});
            await DaoContract.connect(member2).joinClass(2,{value:1000});
            await DaoContract.connect(instructor1).startClass(2);

        });
        it("Should not allow user to withdraw from a Class - Not a STUDENT", async () => {
            
            await expect(DaoContract.connect(member3).withdrawFromClass(1)).to.be.revertedWith(`AccessControl: account ${member3.address.toLowerCase()} is missing role ${STUDENT_ROLE}`);
    
        });
        it("Should not allow user to withdraw from a Class - Class has already started", async () => {
            
            await expect(DaoContract.connect(member2).withdrawFromClass(2)).to.be.revertedWith("This class has already started");
    
        });
        it("Should not allow user to withdraw from a Class - Not enrolled in this class", async () => {
            
            await expect(DaoContract.connect(member2).withdrawFromClass(1)).to.be.revertedWith("User is not enrolled in this class");
    
        });
        it("Should allow user to withdraw from a Class", async () => {
            
            await DaoContract.connect(member1).withdrawFromClass(1);
            expect(await DaoContract.isMemberEnrolledInClass(member1.address, 1)).to.eq(false);
            //expect(await DaoContract.getClassBalance(1)).to.eq(0);
            let classX =  await DaoContract.getClass(2);
            expect(classX.currentNumberOfStudents).to.eq(0);
            //TODO
    
        });
        
    });


});