import './App.css';

function App() {
  return (
    <div className="App flex flex-col">
      <body>
        
      <header className="App-header w-full">
        {/* Navigation */}
        <nav className='flex py-6 bg-slate-500 text-slate-50'>
          <span className='flex-1'>LOGO</span>
          <span className='flex-1'>
            <ul className='inline-flex gap-24'>
              <li>Home</li>
              <li>Classes</li>
              <li>Create</li>
              <li>NFTs</li>
            </ul>
          </span>
          <span className='flex-1 bg-gray-800 hover:bg-blue-700 text-white font-bold px-4 rounded mx-2 align-baseline'>Connect Wallet</span>
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
          <span className='border-solid border-black bg-slate-300 py-11 px-11 m-1'>My Completed Classes</span>
          <span className='border-solid border-black bg-slate-300 py-11 px-11 m-1'>My NFTs</span>
        </section>

      <footer className='bg-gray-600 fixed bottom-0 left-0 w-full flex justify-center items-center text-gray-50 py-8'>FOOTER</footer>
      </body>
    </div>
  );
}

export default App;
