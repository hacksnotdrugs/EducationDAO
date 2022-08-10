// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";

// Users can propose trainings
// Users vote on the trainings they would like to take. TBD: Donation amount 
// If a training has been accepted by the community, a new Class is created and whoever wants to take the class needs to signup (Pay).
// Once a user signs up for a class, they become a student
// THe instructor can start and finish a class. Once it has finished

contract EducationDAO {

    
    // Represents a training proposal
    struct TrainingProposal{
		uint256 id ;
		string name;
		uint256 votes;
		uint256 end;
		bool executed;
	}
    // Represents a class. Created once the training proposal has been approved.
    struct Class{
        uint256 id;
        string name;
        address payable instructor;
        bool started;
        bool ended;
        uint256 studentLimit;
        uint256 price;
        uint256 reviewScore;
    }
    // Represents a student. User becomes a student once they join their first class?
    struct Student{
        address _address;
        uint256[] classes;
    }

    mapping(uint256 => TrainingProposal) public proposals;
	mapping(address => mapping(uint256 => bool)) votes;
    mapping(uint256 => Class) classes;
    // User becomes a student once they join their first class?
    mapping(address => Student) students;
    // Would hold the balances for each class, so at the end of the class we know how much money we need to transfer to the instructor. (And/or to students)
    mapping(uint256 => uint256) classBalances;
    address owner;
    uint256 quorum;



    constructor(uint256 _quorum){
        owner = msg.sender;
        quorum = _quorum;
    }
    
    // Create a proposal
    function createProposal(string memory _name, string memory _data) external{

    }
    //Vote on a proposal
    function vote(uint256 proposalId) external {
		TrainingProposal storage proposal = proposals[proposalId];
		require(votes[msg.sender][proposalId] == false,'User has already voted for this proposal');
		require(block.timestamp < proposal.end, 'Voting period has ended');
		votes[msg.sender][proposalId] = true;
	}

    // Start class -> Only the instructor should be able to start the class. How do we know the instructor's address?
    function startClass(uint256 classId) external verifyInstructor(classId) {
        // Check that msg.sender is the instructor for the given class
        // Check that class is not started
        // Check that class has not ended
    
    }
    // End class -> Only the instructor/owner should be able to end a class.
    //           -> Once the class has ended mint the certificate of completion (NFT).
    function endClass(uint256 classId) external verifyInstructor(classId) {
        // Check that msg.sender is the instructor for the given class
        // Check that class is not started
        // Check that class has not ended
    }

    //  Instructor calls the getPaid method once the class has ended. The instructor triggers the transfer
    function getPaid(uint256 classId) external verifyInstructor(classId) {
        // Check that msg.sender is the instructor for the given class
        // Check that class has ended
        // Check that class has a balance
    }
    // Join class (Payable) -> students would need to pay the full price to join a class.
    function joinClass(uint256 classId) payable external{
        

    }
    // 

    modifier verifyInstructor(uint256 classId){
        Class storage c = classes[classId];
        require(msg.sender == c.instructor, 'Only the instructor can perform this activity');
        _;
    }
}