import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link, useParams } from "react-router-dom";
import { ethers } from "ethers";
import Form from "react-bootstrap/Form";

const UserClassList = ({ blockchain, signer }) => {
  
  // State to store auctions
  const [userClasses, setUserClasses] = useState([]);
  const [nextProposalId, setNextProposalId] = useState(999);
  const [className, setClassName] = useState("Test1");
  const [minNumOfStudents, setMinNumOfStudents] = useState(1);
  const [maxNumOfStudents, setMaxNumOfStudents] = useState(2);
  const [classPrice, setClassPrice] = useState(1000);


  
  const withdrawFromClass = async (e, _classId) => {
    e.preventDefault();
    console.log("WITHDRAWCLASS");
    try {
     await blockchain.daoContract.withdrawFromClass(_classId);
      
      
    } catch (error) {
      console.log(error);
    }
  };
  
  

  useEffect(() => {
    (async () => {
      blockchain.daoContract && setUserClasses(await blockchain.daoContract.getClassesForStudent(blockchain.signerAddress));
      
    })();
  }, [blockchain]);



  return (
    <Container>
      {userClasses.length > 0 ? (
        <div className="row">
        <div className="col-sm-4 first-col">
          <Col>
              <h3>Your Classes: {userClasses.length}</h3>
            
              <table className={`table table-striped trade-list mb-0 ${className}`}>
              <thead>
                <tr>
                    <th>Name</th>
                    <th>Instructor</th>
                    <th>Price</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>
                {userClasses.map((theClass) => (
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
                          {  theClass.started
                            ? <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={e => withdrawFromClass(e, theClass.id)}>Withdraw</Button> 
                            : <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" disabled>Withdraw</Button>
                          }
                         
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </Col>
        </div>
        
      </div>
      ):(<h3>You Don't have any classes, yet!</h3>)}
      
      
    </Container>
  );
};

export default UserClassList;
