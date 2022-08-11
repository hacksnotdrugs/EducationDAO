import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header ">
        {/* Navigation */}
      <nav className='flex py-10 bg-slate-500 mb-24'>
        <span className='flex-1'>LOGO</span>
        <span className='flex-1'>
          <ul className='inline-flex gap-24'>
            <li>Home</li>
            <li>Classes</li>
            <li>Create</li>
            <li>NFTs</li>
          </ul>
        </span>
        <span className='flex-1'>Connect Wallet</span>
      </nav>
      </header>
      <body className=''>
        <main className='bg-slate-200 '>
          <p>Welcome STUDENT!</p>
          <p>What would you like to do today?</p>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1'>Create Class Proposal</button>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1'>Vote</button>
          <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-1'>Join a Class</button>
        </main>
        <section>
          <span>My Upcoming Classes</span>
          <span>My Completed Classes</span>
          <span>My NFTs</span>
        </section>
      </body>
      <footer>FOOTER</footer>
    </div>
  );
}

export default App;
