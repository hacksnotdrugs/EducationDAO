import abiJSON from "./EducationDAOabi.json";
import { ethers } from "ethers";

async function connectContract() {
  //Note: Your contractAddress will start with 0x, delete everything between the quotes and paste your contract address.
  const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const contractABI = abiJSON.abi;
  let EduDAOContract;
  try {
    const { ethereum } = window;

    if (ethereum) {
      //checking for eth object in the window
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      EduDAOContract = new ethers.Contract(contractAddress, contractABI, signer); // instantiating new connection to the contract
      console.log("Connection success!");
    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  return EduDAOContract;
}

export default connectContract;