import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

const CreateProposal = ({ blockchain }) => {
    const [proposalName, setProposalName] = useState("Test1");
    const [proposalInst, setProposalInst] = useState("0x0");
    const [minNumOfStudents, setMinNumOfStudents] = useState(1);
    const [maxNumOfStudents, setMaxNumOfStudents] = useState(2);
    const [classPrice, setClassPrice] = useState(ethers.utils.formatEther(100000));
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const createProposal2 = async (e) => 
    {
        e.preventDefault();
        try 
        {
          console.log("pName: "+proposalName + " - add: " + blockchain.signerAddress + " - min: " + minNumOfStudents + " - max: " + maxNumOfStudents + " - price: " + classPrice);
          await blockchain.daoContract.createProposal(proposalName, blockchain.signerAddress, classPrice, minNumOfStudents, maxNumOfStudents);

          
        } catch (error) {
          console.log(error);
        }
    };


    return (
            <div>
                
                <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1'  onClick={handleShow}>Create Proposal</Button>
                
                <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Proposal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                <Col>
                    <Form className="form" onSubmit={createProposal2}>
                    <Row>
                        <Form.Group className="mb-2" controlId="name">
                        <Row>
                            
                            <Form.Label>Name: </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                onChange={(e) => setProposalName(e.target.value)}
                                required
                            />
                        </Row>
                        <Row>
                            <Form.Label>Price: </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Class Price"
                                onChange= {(e) => setClassPrice(e.target.value)}
                                required
                            />
                            
                        </Row>
                        <Row>
                            <Form.Label>Minimum Number of Students: </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Minimum Number of Students"
                                onChange= {(e) => setMinNumOfStudents(e.target.value)}
                                required
                            />
                            
                        </Row>
                        <Row>
                            <Form.Label>Maximum Number of Students: </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Maximum Number of Students"
                                onChange= {(e) => setMaxNumOfStudents(e.target.value)}
                                required
                            />
                            
                        </Row>
                        <Col className="mb-5">
                        <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" type="submit">
                            Submit
                        </Button>
                        <Button className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded m-1' variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        </Col>
                        </Form.Group>
                        
                    </Row>
                    </Form>
                </Col>
        </Modal.Body>
        <Modal.Footer>
          
        </Modal.Footer>
      </Modal>
            </div>
    );
};
export {CreateProposal};
export default CreateProposal;