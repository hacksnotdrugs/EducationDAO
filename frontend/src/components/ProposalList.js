import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import { ethers } from "ethers";
import Form from "react-bootstrap/Form";
import CreateProposal from "./CreateProposal";
import Table from "react-bootstrap/Table";

const ProposalList = ({ blockchain, signer }) => {
  
  // State variables
  const [proposals, setProposals] = useState([]);
  const [nextProposalId, setNextProposalId] = useState(999);
  const [proposalName, setProposalName] = useState("Test1");
  const [proposalInst, setProposalInst] = useState("0x0");
  const [minNumOfStudents, setMinNumOfStudents] = useState(1);
  const [maxNumOfStudents, setMaxNumOfStudents] = useState(2);
  const [classPrice, setClassPrice] = useState(1000);
  const [isMemberEnrolled, setIsMemberEnrolled] = useState(false);
  const [proposalEventObject, setProposalEventObject] = useState([]);
  const [voteEventObject, setVoteEventObject] = useState([]);
  const [classEventObject, setClassEventObject] = useState();


  // // Listen for NewProposalCreated Event!
  // try {
    
  //   blockchain.listenerForContract.on("NewProposalCreated", (
  //     proposalId,
  //     creatorAddress,
  //     minVotesRequired
  //   ) => {
  //     console.log("PROPOSAL event listener 'on'");
  //     let previous = proposalEventObject
  //     let info = {
  //       proposalId: proposalId,
  //       creatorAddress: creatorAddress,
  //       minVotesRequired: minVotesRequired
  //     }
  //     setProposalEventObject([...previous, info]);
  //     console.log("New eventObject saved:")
  //     console.log("From proposalId: ", proposalEventObject.proposalId.toNumber())
  //     console.log("From creatorAddress: ", proposalEventObject.creatorAddress)
  //     console.log("From minVotesRequired: ", proposalEventObject.minVotesRequired.toNumber())
  //   })
  // } catch (error) {
  //   console.log(error)
  // }

  // // Listen for NewVoteCount Event!
  // try {
    
  //   blockchain.listenerForContract.on("NewVoteCount", (
  //     proposalId,
  //     voterAddress,
  //     voteCount
  //   ) => {
  //     console.log("VOTE event listener 'on'");
  //     let previous = voteEventObject;
  //     let info = {
  //       proposalId: proposalId,
  //       voterAddress: voterAddress,
  //       voteCount: voteCount
  //     }
  //     setVoteEventObject([...previous, info]);
  //     console.log("New VOTE saved:")
  //     console.log("From proposalId: ", voteEventObject.proposalId.toNumber())
  //     console.log("From voterAddress: ", voteEventObject.voterAddress)
  //     console.log("From voteCount: ", voteEventObject.voteCount.toNumber())
  //   })
  // } catch (error) {
  //   console.log(error)
  // }

  // // Listen for NewClassCreated Event!
  // try {
    
  //   blockchain.listenerForContract.on("NewClassCreated", (
  //     proposalId,
  //     instructorAddress,
  //     maxStudentCount,
  //     minStudentCount
  //   ) => {
  //     console.log("VOTE event listener 'on'");
  //     let info = {
  //       proposalId: proposalId,
  //       instructorAddress: instructorAddress,
  //       maxStudentCount: maxStudentCount,
  //       minStudentCount: minStudentCount 
  //     }
  //     setClassEventObject(info);
  //     console.log("New CLASS saved:")
  //     console.log("From proposalId: ", classEventObject.proposalId.toNumber())
  //     console.log("From instructorAddress: ", classEventObject.instructorAddress)
  //     console.log("From maxStudentCount: ", classEventObject.maxStudentCount.toNumber())
  //     console.log("From minStudentCount: ", classEventObject.minStudentCount.toNumber())
  //   })
  // } catch (error) {
  //   console.log(error)
  // }

  

  const getProposalList = async (e) => {
    try
    {
      setProposals(await blockchain.daoContract.getAllProposals());
    }
    catch (error) {
      console.log(error);
    }
  }

  const vote = async (e, proposalId) => {
    //TODO
    try {
      console.log(`VOTE button clicked for proposal # ${proposalId}!`);
      await blockchain.daoContract.vote(proposalId);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      blockchain.daoContract && await getProposalList();
    })();
  }, [blockchain, proposals]);



  return (
    <Container centered>
      <div>
        <div>
          <Col>
              <h3>All proposals: {proposals.length}</h3>
            
              <Table striped bordered hover centered>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Instructor</th>
                    <th>Price</th>
                    <th>Link</th>
                    <th>Vote</th>
                    <th>Voted</th>
                    <th>Min # Votes</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                {proposals.map((theProposal) => (
                  <tr key={theProposal.id}>
                      <td>{theProposal.name}</td>
                      <td>{theProposal.instructor}</td>
                      <td>{theProposal.price.toString()}</td>
                      <td>
                          <Link
                            to={`/proposal/${theProposal.id}`}
                            state={{
                              class: {
                                ...theProposal,
                              },
                            }}
                          >
                            <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary">View</Button>
                            
                          </Link>
                      </td>
                      <td>
                        <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={ (e) => vote(e, theProposal.id)}>Vote</Button>
                      </td> 
                      <td>{theProposal.voteCount.toString()}</td>
                      <td>{theProposal.minimumVotes.toString()}</td>
                      <td>{theProposal.voteCount >= theProposal.minimumVotes ? "Executed": "Open"}</td>
                      {/* <td>
                        {voteEventObject && voteEventObject.voteCount.toNumber()}
                      </td> 
                      <td>
                        {proposalEventObject && proposalEventObject[theProposal.id].minVotesRequired.toNumber()} 
                      </td>  */}
                    </tr>
                ))}
                </tbody>
              </Table>
            </Col>
            <Col style={{display: 'flex',  justifyContent:'center', alignItems:'center', height: '100vh'}}>
           
            </Col>
        </div>
        
      </div>
    </Container>
  );
};

export default ProposalList;
