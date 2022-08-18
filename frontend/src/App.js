import './App.css';
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { getBlockchain } from "./utils/common";
import JoinDAO from "./components/joinDAO";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ClassList from "./components/ClassList";
import UserClassList from "./components/UserClassList";
import ClassDetail from "./components/ClassDetail";

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
    

  return (
    <div className="App flex flex-col">
      <body>
        
      <header className="App-header w-full">
        {/* Navigation */}
        <nav className='flex py-6 bg-slate-500 text-slate-50'>
          {/* <span className='flex-1'>LOGO</span> */}
          <span className='flex-2'>
            <JoinDAO blockchain={blockchain}/>
          </span>
          <span className='flex-1'>
            <ul className='inline-flex gap-24'>
              <li><a href="/">Home</a></li>
              <li><a href="/class/all">Classes</a></li>
              <li>Create</li>
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
        </nav>
      </header>
        <main className='bg-slate-200 py-11 mb-7'>
          <p className='text-gray-800 text-4xl font-bold'>Welcome STUDENT!</p>
          <p>What would you like to do today?</p>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1'>Create Class Proposal</button>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1'>Vote</button>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1'>Join a Class</button>
        </main>
        <section>
          <span className='border-solid border-black bg-slate-300 py-11 px-11 m-1'>My Upcoming Classes</span>
          <Router>
            <Routes>
              <Route path="/" element={<UserClassList blockchain={blockchain} />} />
              <Route path="/class/all" element={<ClassList blockchain={blockchain} />} />
              <Route
                path="/class/:classId"
                element={<ClassDetail blockchain={blockchain} />}
              />
              
            </Routes>
          </Router>
          {/* <span className='border-solid border-black bg-slate-300 py-11 px-11 m-1'>My Completed Classes</span>
          <span className='border-solid border-black bg-slate-300 py-11 px-11 m-1'>My NFTs</span> */}
        </section>
        

      <footer className='text-2xl font-semibold bg-gray-600 fixed bottom-0 left-0 w-full flex justify-center items-center text-gray-50 py-8'>EducationDAO</footer>
      </body>
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
