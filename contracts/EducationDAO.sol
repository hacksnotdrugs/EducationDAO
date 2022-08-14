// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

// Users can propose trainings
// Users vote on the trainings they would like to take. TBD: Donation amount 
// If a training has been accepted by the community, a new Class is created and whoever wants to take the class needs to signup (Pay).
// Once a user signs up for a class, they become a student
// THe instructor can start and finish a class. Once it has finished

contract EducationDAO is AccessControl {
    

    // Create a new role identifier for the minter role
    bytes32 public constant STUDENT_ROLE = keccak256("STUDENT_ROLE");
    bytes32 public constant INSTRUCTOR_ROLE = keccak256("INSTRUCTOR_ROLE");
    bytes32 public constant MEMBER_ROLE = keccak256("MEMBER_ROLE");
    
    // Represents a training proposal 
    struct TrainingProposal{
		uint256 id ;
		string name;
        address instructor;
		uint256 voteCount;
		uint256 end;
        uint256 price;
        uint8 minimumVotes;
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
        uint256 currentNumberOfStudents;
        uint256 price;
        uint256 reviewScore;
        
    }
    // Represents a student. User becomes a student once they join their first class?
    struct Member{
        address _address;
        // Mapping of the classes where the student has enrolled. The bool represents if the user is currently enrolled.
        mapping(uint256 => bool) studentClasses;
    }
    

    mapping(uint256 => TrainingProposal) public proposals;
	mapping(address => mapping(uint256 => bool)) whoVoted;
    mapping(uint256 => Class) classes;
    // User becomes a student once they join their first class?
    mapping(address => Member) members;
    // Holds the balances for each class, so at the end of the class we know how much money we need to transfer to the instructor. 
    mapping(uint256 => uint256) classBalances;
    // Holds the balance for each student. In case they withdraw from their classes.
    mapping(address => uint256) studentBalances;

    address owner;
    uint256 quorum;
    uint256 memberFee;
    uint256 public memberCount;
    uint256 public classCount;
	uint public voteTime;
    uint public nextProposalId;


    constructor(uint256 _memberFee){
        owner = msg.sender;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        memberFee = _memberFee;
        memberCount = 0;
    }

    

    // Handles users joining the DAO.
    function joinDAO() payable external {
        // Check value sent is enough
        require(msg.value >= memberFee, "Not enough ETH to join the DAO");
        // Check that user is not already a member
        require(!hasRole(MEMBER_ROLE, msg.sender), "Caller is already a member!");
        _setupRole(MEMBER_ROLE, msg.sender);
        Member storage s = members[msg.sender];
        s._address = msg.sender;
        memberCount += 1;
    }

    // Create a proposal
    function createProposal(string memory _name, string memory _data, uint256 _price) external onlyRole("MEMBER_ROLE"){
        require(hasRole(MEMBER_ROLE, msg.sender), "Caller is not a member!");
        uint256 voteCount = 0;

        proposals[nextProposalId] = TrainingProposal(
            nextProposalId,
            _name,
            msg.sender,
            voteCount,
            block.timestamp + voteTime,
            _price,
            2,
            false
        );
        nextProposalId++;
    }

    //Vote on a proposal
    function vote(uint256 proposalId) external onlyRole("MEMBER_ROLE"){
		TrainingProposal storage proposal = proposals[proposalId];
		require(whoVoted[msg.sender][proposalId] == false, "User has already voted for this proposal");
		require(block.timestamp < proposal.end, "Voting period has ended");
		whoVoted[msg.sender][proposalId] = true;
        proposal.voteCount+=1;
        if (proposal.voteCount == proposal.minimumVotes){
            createClass(proposal.name, proposal.instructor, 20, proposal.price);
        }
	}

    // TODO
    function createClass(string className, address payable _instructor, uint256 _studentLimit, uint256 _price) internal {
        uint256 nextClassId = classCount+1;
        classes[nextClassId] = Class({
            id: nextClassId,
            name: nextClassId,
            instructor: _instructor,
            started: false,
            ended: false,
            studentLimit: _studentLimit,
            currentNumberOfStudents: 0,
            price: _price,
            reviewScore: 0
        });
        classCount = nextClassId;
    }

    // Start class -> Only the instructor should be able to start the class. How do we know the instructor's address?
    function startClass(uint256 classId) external verifyInstructor(classId) {
        // Check that msg.sender is the instructor for the given class
        Class storage c = classes[classId];
        // Check that the class has not started
        require(c.started == false, "This class has already started" );
        // Check that class has not ended
        require(c.ended == false, "This class has already ended" );
        c.started = true;
        _setupRole(INSTRUCTOR_ROLE, msg.sender);
    
    }
    // End class -> Only the instructor/owner should be able to end a class.
    //           -> Once the class has ended mint the certificate of completion (NFT).
    function endClass(uint256 classId) external verifyInstructor(classId) {
        // Check that msg.sender is the instructor for the given class
        // Check that msg.sender is the instructor for the given class
        Class storage c = classes[classId];
        // Check that the class has started
        require(c.started == true, "This class has not started" );
        // Check that class has not ended
        require(c.ended == false, "This class has already ended" );
        c.ended = true;
    }

    
    // Join class (Payable) -> members would need to pay the full price to join a class.
    // Update the class currentNumberOfmembers and balance
    function joinClass(uint256 classId) payable external onlyRole("MEMBER_ROLE"){
        Class storage c = classes[classId];
        // Check that the class has not started
        require(c.started == false, "This class has already started" );
        // Check the the amount sent is >= than the class price
        require(msg.value >= c.price, "Not enough ETH to join this class");
        // CHeck if the class is full
        require(isClassFull(classId) == false, "Class is full");
        // If the user is already a student
        if(getRoleMember(STUDENT_ROLE, msg.sender)){
            // Check that the user is not already enrolled in the class
            require(members[msg.sender].studentClasses[classId] == false, "You are already enrolled in this class");
            members[msg.sender].studentClasses[classId] = true;
            classBalances[classId] += msg.value;
            c.currentNumberOfStudents += 1;
        }
        else
        {
            Member storage s = members[msg.sender];
            s.studentClasses[classId] = true;
            classBalances[classId] += msg.value;
            c.currentNumberOfStudents += 1;
            _setupRole(STUDENT_ROLE, msg.sender);
        }

    }

    function isClassFull(uint256 classId) internal view returns (bool){
        Class storage c = classes[classId];
        return !(c.currentNumberOfStudents < c.studentLimit);
    }

    // Withdraw from class. members are allowed to withdraw from a class as long as the class hasn't started. (For now)
    // TODO Refund policies
    function withdrawFromClass(uint256 classId) external onlyRole("STUDENT_ROLE"){
        Class storage c = classes[classId];
        require(c.started == false, "This class has already started" );
        Member storage s = members[msg.sender];
        require(s.studentClasses[classId] == true, "User is not enrolled in this class");
        // The following condition should never happen
        require(classBalances[classId] > c.price, "Class does not have enough balance");
        s.studentClasses[classId] = false;
        classBalances[classId] = classBalances[classId] - c.price;
        studentBalances[msg.sender] = studentBalances[msg.sender] + c.price;
        c.currentNumberOfStudents -= 1;  
    }

    // students rate the class
    function rateClass(uint256 classId, uint256 score) external onlyRole("STUDENT_ROLE") {
        //TODO
    }

    function setMemberFee(uint newMemberFee) external onlyRole("DEFAULT_ADMIN_ROLE"){
        memberFee = newMemberFee;
    }

    // Admin adds the  role to the instructor address
    function addInstructor(address instAddress) external onlyRole("DEFAULT_ADMIN_ROLE"){
        //TODO
    }

    // members get their refunds
    function getRefund() external onlyRole("STUDENT_ROLE"){
        //TODO
    }
    //  Instructor calls the getPaid method once the class has ended. The instructor triggers the transfer
    // A student will only get an NFT after submitting 1-5 star rating, and - the instructor is only paid if at least X number of members submit their rating
    // That way the student and the instructor is protected.
    function getPaid(uint256 classId) external verifyInstructor(classId) {
        // Check that msg.sender is the instructor for the given class
        // Check that class has ended
        // Check that class has a balance
        //TODO
    }

    function getMember(address _member) external{
        //TODO 
    }

    // Modifier to verify that msg sender is the instructor for the given class.
    modifier verifyInstructor(uint256 classId){
        Class storage c = classes[classId];
        require(msg.sender == c.instructor, "Only the instructor can perform this activity");
        _;
    }


    
}