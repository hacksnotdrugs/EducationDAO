import React, { useEffect, useState } from "react";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";

const ClassList = ({ blockchain, signer }) => {
  
  // State to store auctions
  const [classes, setClasses] = useState([]);

  const [className, setClassName] = useState("");
  const [classInst, setClassInst] = useState("0x0");
  const [minNumOfStudents, setMinNumOfStudents] = useState(1);
  const [maxNumOfStudents, setMaxNumOfStudents] = useState(2);
  const [classPrice, setClassPrice] = useState(1000);



  const joinClass = async (e, _classId, _classPrice) => {
    e.preventDefault();
    console.log("JOINCLASS");
    try {
     await blockchain.daoContract.joinClass(_classId, {value: _classPrice});
      
      
    } catch (error) {
      // let betterError = error.split("(reason=");
      // let msg = betterError[1];
      alert(error.code);
      console.log(error);
    }
  };

  const startClass = async (e, _classId) => {
    e.preventDefault();
    
    try {
     let tx = await blockchain.daoContract.startClass(_classId);
     
     await getClassList();
      
    } catch (error) {
      console.log(error);
      console.log(error);
    }
  };

  const endClass = async (e, _classId) => {
    e.preventDefault();
    
    try {
     await blockchain.daoContract.endClass(_classId);
      
      
    } catch (error) {
      console.log(error);
    }
  };
  const rateClass = async (e, _classId) => {
    e.preventDefault();
    
    try {
     await blockchain.daoContract.startClass(_classId);
      
      
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
  const isMemberEnrolledInClass = async ( _classId) => {
    console.log("inside isMemberEnrolled");
    let response = false;
    
    try {
     response =  await blockchain.daoContract.isMemberEnrolledInClass(window.ethereum.selectedAddress, _classId);
     console.log("isMemberEnrolled: " + response);
      
    } catch (error) {
      console.log(error);
    }
    return response;
  };
  const createClass = async (e) => {
    e.preventDefault();
    try {
      //await blockchain.daoContract.createClass("Class 1", blockchain.signerAddress, ethers.BigNumber.from("1"), ethers.BigNumber.from("2"), ethers.utils.parseEther("0.01"));
      //console.log("cName: "+className + " - add: " + blockchain.signerAddress + " - min: " + minNumOfStudents + " - max: " + maxNumOfStudents + " - price: " + classPrice);
      await blockchain.daoContract.createClass(className, classInst, minNumOfStudents, maxNumOfStudents, classPrice);
      //console.log("inside createclass");
      
    } catch (error) {
      console.log(error);
    }
  };

  const getClassList = async (e) => {
    try
    {
      setClasses(await blockchain.daoContract.getAllClasses());
    }
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      blockchain.daoContract && await getClassList();
    })();
  }, [blockchain]);



  return (
    <Container centered>
      <div >
        <div >
          <Col>
              <h3>All Classes: {classes.length}</h3>
            
              <Table striped bordered hover centered>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Instructor</th>
                    <th>Price</th>
                    <th>Details</th>
                    <th>Actions</th>
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
                      {  (window.ethereum.selectedAddress === theClass.instructor.toLowerCase()) 
                          ? ( 
                              theClass.started === false 
                              ? <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={e => startClass(e, theClass.id)}>Start Class</Button> 
                              : (theClass.started === true && theClass.ended === false) 
                                ? <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={e => endClass(e, theClass.id)}>End Class</Button>
                                : (theClass.ended === true) ? <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={e => startClass(e, theClass.id)}>Get Paid</Button> : "" 
                            )
                          : 
                            (
                              (isMemberEnrolledInClass(theClass.id, window.ethereum.selectedAddress) === true) 
                                ? (theClass.started === false)
                                  ? <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={e => withdrawFromClass(e, theClass.id)}>Withdraw</Button>  
                                    : (theClass.started === true && theClass.ended === false)
                                      ? "Class in progress"
                                      : (theClass.ended === true) ? <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={e => rateClass(e, theClass.id)}>Rate Class</Button>
                                  : ""
                                : <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={e => joinClass(e, theClass.id, theClass.price)}>Join</Button>

                            )
                      }
                      </td> 
                        
                    </tr>
                ))}
                </tbody>
              </Table>
            </Col>
        </div>
        {/* <div className="col-sm-4 mb-5">
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
                  <Form.Label>Address: </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    onChange= {(e) => setClassInst(e.target.value)}
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
        </div> */}
      </div>
    </Container>
  );
};

export default ClassList;
