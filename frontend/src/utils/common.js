import { ethers } from "ethers";
import ContractAddress from "./../abis/contract-address.json";
import ContractAbi from "./../abis/EducationDAO.json";
//import Swal from "sweetalert2";

const getBlockchain = () =>
  new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signerAddress = await signer.getAddress();

        const daoContract = new ethers.Contract(
          ContractAddress.DAO,
          ContractAbi.abi,
          signer
        );

        const listenerForContract = new ethers.Contract(
          ContractAddress.DAO,
          ContractAbi.abi,
          provider
        )
            console.log(listenerForContract);
        resolve({ signerAddress, daoContract, listenerForContract });
      }
      resolve({ signerAddress: undefined, daoContract: undefined, listenerForContract: undefined });
    });
  });

  const isUserAMember = async (blockchain, role, signerAddress) => {
      
    const kROLE = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(role));
    let isMember = await blockchain.daoContract.hasRole(kROLE, signerAddress);
    return isMember;
  }

// function showError(error) {
//   Swal.fire({
//     icon: "error",
//     title: "Transaction Failed",
//     text: error.toString(),
//   });
//}



export { getBlockchain, isUserAMember };
export default getBlockchain;