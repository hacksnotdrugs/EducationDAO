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



const ProposalDetail = ({ blockchain, props }) => {
    const [theProposal, setTheProposal] = useState({});
    const { proposalId } = useParams();
    console.log("ProposalId: "+proposalId);
    const getProposal = async proposalId => {
        //console.log("inside getOffers:" + user.userAddress);
        const _class = await blockchain.daoContract.getClass(proposalId);
        //console.log("Offers: "+ _offers.length);
        setTheProposal(_class);
        
      }
    useEffect(() => {
        (async () => {
          
          try {
            const bc = blockchain.daoContract && await getProposal(proposalId);
            
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
      }, [blockchain, theProposal, proposalId]);

      return (
        // <Modal>
        // <ModalContent>
        //   <ModalGrid>
            
            <div>
            <h3>{theProposal.name}</h3>
            <p>{}</p>
      <p>A detailed description of your proposal!</p>

              
            </div>
    //       </ModalGrid>
    //       <CloseButton onClick={() => props.toggleModal()} >
    //         &times;
    //       </CloseButton>
    //     </ModalContent>
    //   </Modal>
        );
    };

export default ProposalDetail;