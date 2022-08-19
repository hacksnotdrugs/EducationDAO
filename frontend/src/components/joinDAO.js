import React, { useEffect, useState } from "react";
import { isUserAMember } from "./../utils/common";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";



const JoinDAO = ({ blockchain }) => {

    const [isMember, setIsMember] = useState(false);
    const MEMBER_ROLE = "MEMBER_ROLE";

    useEffect(() => {
        (async () => {
          blockchain.daoContract && setIsMember(await isUserAMember(blockchain, MEMBER_ROLE, blockchain.signerAddress)); // && setNextProposalId(await blockchain.daoContract.nextProposalId());
        })();
      }, [blockchain, isMember]);

    const joinDAO = async (e) => {
        e.preventDefault();
        console.log("inside joinDAO");
        try {
          const MEMBER_FEE = await blockchain.daoContract.memberFee();
         await blockchain.daoContract.joinDAO({value: MEMBER_FEE});
          
          
        } catch (error) {
          console.log(error);
        }
      };

    return (
        <Container>
       { isMember ? "Welcome back!" 
       : <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={e => joinDAO}>Join the DAO!</Button>
        }
        </Container>
    );
};
export default JoinDAO