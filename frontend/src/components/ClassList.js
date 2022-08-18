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
  const [classes, setClasses] = useState([]);
  const [nextProposalId, setNextProposalId] = useState(999);
  const [className, setClassName] = useState("Test1");
  const [minNumOfStudents, setMinNumOfStudents] = useState(1);
  const [maxNumOfStudents, setMaxNumOfStudents] = useState(2);
  const [classPrice, setClassPrice] = useState(1000);


  const joinClass = async (e, _classId, _classPrice) => {
    e.preventDefault();
    console.log("JOINCLASS");
    try {
     await blockchain.daoContract.joinClass(_classId, {value: _classPrice});
      console.log("inside createclass");
      
    } catch (error) {
      console.log(error);
    }
  };

  const withdrawFromClass = async (e, _classId) => {
    e.preventDefault();
    console.log("WITHDRAWCLASS");
    try {
     await blockchain.daoContract.withdrawFromClass(_classId);
      
      
    } catch (error) {
      console.log(error);
    }
  };
  const isMemberEnrolledInClass = async ( _classId, member) => {
    console.log("inside isMemberEnrolled");
    let response = false;
    
    try {
     response =  await blockchain.daoContract.isMemberEnrolledInClass(_classId, member);
      
      
    } catch (error) {
      console.log(error);
    }
    return response;
  };
  const createClass = async (e) => {
    e.preventDefault();
    try {
      //await blockchain.daoContract.createClass("Class 1", blockchain.signerAddress, ethers.BigNumber.from("1"), ethers.BigNumber.from("2"), ethers.utils.parseEther("0.01"));
      console.log("cName: "+className + " - add: " + blockchain.signerAddress + " - min: " + minNumOfStudents + " - max: " + maxNumOfStudents + " - price: " + classPrice);
      await blockchain.daoContract.createClass(className, blockchain.signerAddress, minNumOfStudents, maxNumOfStudents, classPrice);
      console.log("inside createclass");
      
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      blockchain.daoContract && setClasses(await blockchain.daoContract.getAllClasses());
    })();
  }, [blockchain]);



  return (
    <Container>
      <div className="row">
        <div className="col-sm-4 first-col">
          <Col>
              <h3>All Classes: {classes.length}</h3>
            
              <table className={`py-4 mt-5 mx-auto table-striped trade-list ${className}`}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Instructor</th>
                    <th>Price</th>
                    <th>Link</th>
                    <th></th>
                    <th>Start</th>
                  </tr>
                </thead>
                <tbody>
                {classes.map((theClass) => (
                  <tr key={theClass.id}>
                      <td>{theClass.name}</td>
                      <td>{theClass.instructor}</td>
                      <td>{theClass.price.toString()}</td>
                      <td>
                          <Link
                            to={`/class/${theClass.id}`}
                            state={{
                              class: {
                                ...theClass,
                              },
                            }}
                          >
                            <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary">View</Button>
                            
                          </Link>
                      </td>
                      <td>
                          <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={e => joinClass(e, theClass.id, theClass.price)}>Join</Button>
                      </td>
                        <td>
                        {  (window.ethereum.selectedAddress == theClass.instructor.toLowerCase()) ?
                          <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={e => joinClass(e, theClass.id, theClass.price)}>Start Class</Button>
                          : "" 
                          }
                        </td> 
                    </tr>
                ))}
                </tbody>
              </table>
            </Col>
        </div>
        <div className="col-sm-4 mb-5">
          <Col>
            <Form className="form" onSubmit={createClass}>
              <Row>
                <Col>
                <Form.Group className="mb-2" controlId="name">
                  <Form.Label>Name: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    onChange={(e) => setClassName(e.target.value)}
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