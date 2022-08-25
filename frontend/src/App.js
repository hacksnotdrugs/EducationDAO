import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { getBlockchain } from "./utils/common";
import JoinDAO from "./components/joinDAO";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import ClassList from "./components/ClassList";
import ProposalList from "./components/ProposalList";
import UserClassList from "./components/UserClassList";
import ClassDetail from "./components/ClassDetail";
import ProposalDetail from './components/ProposalDetail';
import CreateProposal from "./components/CreateProposal";
import { ethers } from 'ethers';
import ButtonToolbar from 'react-bootstrap/esm/ButtonToolbar';
import Button from 'react-bootstrap/esm/Button';
import Container from 'react-bootstrap/esm/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

const { chains, provider } = configureChains(
  [chain.localhost, chain.goerli],
  [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

function App() {

  
  const [blockchain, setBlockchain] = useState({});
  
  
  
  useEffect(() => {
    (async () => {
      setBlockchain(await getBlockchain()); // && setNextProposalId(await blockchain.daoContract.nextProposalId());
    })();
  }, []);

  const openLink = (e) => {
    e.preventDefault();
    window.location = '/class/all';
  }
    
  return (
    <div className="App flex flex-col">
        
      <header className="App-header w-full">
        {/* Navigation */}
        {/* <nav className='flex py-6 bg-slate-500 text-slate-50'>
          {/* <span className='flex-1'>LOGO</span> */}
          {/* <span className='flex-2'>
           <JoinDAO blockchain={blockchain}/>
          </span>
          <span className='flex-1'>
            <ul className='inline-flex gap-24'>
              <li><a href="/">Home</a></li>
              
              <li><a href="/class/all">Classes</a></li>
              <li><a href="/proposal/all">Proposals</a></li>
              <li>NFTs (Coming Soon!)</li>
            </ul>
          </span>
          <span>
            <WagmiConfig client={wagmiClient}>
              <RainbowKitProvider chains={chains}>
                <YourComponent />
              </RainbowKitProvider>
            </WagmiConfig>
          </span>
        </nav> */} 

        <Navbar bg="primary" variant="dark">
        <Container>
          <span>
          <JoinDAO blockchain={blockchain}/>
          </span>
          {/* <Navbar.Brand href="#home">EducationDAO</Navbar.Brand> */}
          <Nav className="me-auto" centered>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/class/all">Classes</Nav.Link>
            <Nav.Link href="/proposal/all">Proposals</Nav.Link>
            <Nav.Link href="#">NFTs (Coming Soon!)</Nav.Link>
          </Nav>
        </Container>
        <span>
            <WagmiConfig client={wagmiClient}>
              <RainbowKitProvider chains={chains}>
                <YourComponent />
              </RainbowKitProvider>
            </WagmiConfig>
          </span>
        </Navbar>
      </header>
      
        <main className='bg-slate-200 py-11 mb-7' centered>
          <h2 className=''>Welcome STUDENT!</h2>
          <p>What would you like to do today?</p>
          <div className="justify-content-md-center" centered>
            <ButtonToolbar className="justify-content-md-center">
              <CreateProposal blockchain={blockchain} />
              <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1'>Vote</Button>
              <Button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1' onClick={(e) => openLink(e)}>Join a Class</Button>
            </ButtonToolbar>
          </div>
        </main>
        
        <section className='border-solid border-black  py-10 m-1'>
          
          <Router centered>
            <Routes>
              <Route path="/" element={<UserClassList blockchain={blockchain} />} />
              <Route path="/class/all" element={<ClassList blockchain={blockchain} />} />
              <Route path="/proposal/all" element={<ProposalList blockchain={blockchain} />} />
              <Route
                path="/class/:classId"
                element={<ClassDetail blockchain={blockchain} />}
              />
              <Route
                path="/proposal/:proposalId"
                element={<ProposalDetail blockchain={blockchain} />}
              />
              
            </Routes>
          </Router>
          
          {/* <span className='border-solid border-black bg-slate-300 py-11 px-11 m-1'>My Completed Classes</span>
          <span className='border-solid border-black bg-slate-300 py-11 px-11 m-1'>My NFTs</span> */}
        </section>
        

      <footer className='text-2xl font-semibold bg-gray-600 fixed bottom-0 left-0 w-full flex justify-center items-center text-gray-50 py-8'>EducationDAO</footer>
    </div>
  );
}

const YourComponent = () => {
  return (
    <div
      style={{
      }}
    >
      <ConnectButton />
    </div>
  );
};

export default App;
