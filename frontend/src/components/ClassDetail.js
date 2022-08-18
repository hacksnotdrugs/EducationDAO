import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";
import { useLocation, useParams } from "react-router-dom";
// import { showError } from "../utils/common";



const ClassDetail = ({ blockchain, props }) => {
    const [theClass, setTheClass] = useState({});
    const { classId } = useParams();
    console.log("ClassId: "+classId);
    const getClass = async classId => {
        //console.log("inside getOffers:" + user.userAddress);
        const _class = await blockchain.daoContract.getClass(classId);
        //console.log("Offers: "+ _offers.length);
        setTheClass(_class);
        
      }
    useEffect(() => {
        (async () => {
          
          try {
            const bc = blockchain.daoContract && await getClass(classId);
            
            //setOffers(off);
            
              //setOffers(await blockchain.ebay.getAuctionOffers(auction.id));
              //console.log("OffersEffect:" + offers.length);
              //console.log("Offs: "+ offs.length);
              //setOffers(offs);
          } catch (error) {
            //showError(error);
            console.log(error);
          }
        })();
      }, [blockchain, theClass, classId]);

      return (
        // <Modal>
        // <ModalContent>
        //   <ModalGrid>
            
            <div>
            <h3>{theClass.name}</h3>
            <p>{}</p>
      <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...</p>

              
            </div>
    //       </ModalGrid>
    //       <CloseButton onClick={() => props.toggleModal()} >
    //         &times;
    //       </CloseButton>
    //     </ModalContent>
    //   </Modal>
        );
    };

export default ClassDetail;