import React, { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";




const JoinDAO = ({ blockchain }) => {

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
        <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' variant="primary" onClick={e => joinDAO(e)}>Join the DAO!</Button>
    )
};
export default JoinDAO