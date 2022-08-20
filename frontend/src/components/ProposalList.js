import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import { ethers } from "ethers";
import Form from "react-bootstrap/Form";

const ClassList = ({ blockchain, signer }) => {
  
  // State to store auctions
  const [proposals, setProposals] = useState([]);
  const [nextProposalId, setNextProposalId] = useState(999);
  const [proposalName, setProposalName] = useState("Test1");
  const [proposalInst, setProposalInst] = useState("0x0");
  const [minNumOfStudents, setMinNumOfStudents] = useState(1);
  const [maxNumOfStudents, setMaxNumOfStudents] = useState(2);
  const [classPrice, setClassPrice] = useState(1000);
  const [isMemberEnrolled, setIsMemberEnrolled] = useState(false);



  const createProposal = async (e) => {
    e.preventDefault();
    try {
      console.log("pName: "+proposalName + " - add: " + blockchain.signerAddress + " - min: " + minNumOfStudents + " - max: " + maxNumOfStudents + " - price: " + classPrice);
      await blockchain.daoContract.createProposal(proposalName, proposalInst, classPrice, minNumOfStudents, maxNumOfStudents);
      console.log("inside createproposal");
      
    } catch (error) {
      console.log(error);
    }
  };

  const getProposalList = async (e) => {
    try
    {
      setProposals(await blockchain.daoContract.getAllProposals());
    }
    catch (error) {
      console.log(error);
    }
  }

  const vote = async (e) => {
    //TODO
    try {
      console.log("VOTE button clicked!")
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      blockchain.daoContract && await getProposalList();
    })();
  }, [blockchain]);



  return (
    <Container>
      <div className="row">
        <div className="col-sm-4 first-col">
          <Col>
              <h3>All proposals: {proposals.length}</h3>
            
              <table className={`py-4 mt-5 mx-auto table-striped trade-list ${proposalName}`}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Instructor</th>
                    <th>Price</th>
                    <th>Link</th>
                    <th>Vote</th>
                    <th>Voted</th>
                    <th>Min <br/># Votes</th>
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
                        <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={e => vote(e)}>Vote</Button>
                      </td> 
                      <td>
                      
                      </td> 
                      <td>
                      
                      </td> 
                    </tr>
                ))}
                </tbody>
              </table>
            </Col>
        </div>
        <div className="col-sm-4 mb-5">
          <Col>
            <Form className="form" onSubmit={createProposal}>
              <Row>
                <Col>
                <Form.Group className="mb-2" controlId="name">
                  <Form.Label>Name: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    onChange={(e) => setProposalName(e.target.value)}
                    required
                  />
                  <Form.Label>Address: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    onChange= {(e) => setProposalInst(e.target.value)}
                    required
                  />
                </Form.Group>
                </Col>
                <Col className="mb-5">
                  <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </div>
      </div>
    </Container>
  );
};

export default ClassList;
