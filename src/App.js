import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './contractConfig';
import './App.css';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [swapTicketId, setSwapTicketId] = useState('');
  const [acceptSwapId, setAcceptSwapId] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
          
          setWeb3(web3Instance);
          setContract(contractInstance);
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Error connecting to MetaMask', error);
        }
      }
    };

    initWeb3();
  }, []);

  const buyTicket = async () => {
    try {
      const price = await contract.methods.ticketPrice().call();
      await contract.methods.buyTicket(ticketId).send({
        from: account,
        value: price
      });
      alert('Ticket purchased successfully!');
    } catch (error) {
      console.error('Error buying ticket:', error);
      alert('Error buying ticket: ' + error.message);
    }
  };

  const offerSwap = async () => {
    try {
      await contract.methods.offerSwap(swapTicketId).send({
        from: account
      });
      alert('Swap offer made successfully!');
    } catch (error) {
      console.error('Error offering swap:', error);
      alert('Error offering swap: ' + error.message);
    }
  };

  const acceptSwap = async () => {
    try {
      await contract.methods.acceptSwap(acceptSwapId).send({
        from: account
      });
      alert('Swap accepted successfully!');
    } catch (error) {
      console.error('Error accepting swap:', error);
      alert('Error accepting swap: ' + error.message);
    }
  };

  const getTicketNumber = async () => {
    try {
      const ticket = await contract.methods.getTicketOf(account).call();
      alert('Your ticket number is: ' + ticket);
    } catch (error) {
      console.error('Error getting ticket:', error);
      alert('Error getting ticket: ' + error.message);
    }
  };

  return (
    <div className="App">
      <div className="header-text">
        <h2>There are total 100 tickets</h2>
        <h2>The price of each ticket is 0.00001 ether</h2>
      </div>

      <div className="container">
        <div className="row">
          <div className="box">
            <input 
              type="text" 
              placeholder="Enter Ticket Id"
              value={ticketId}
              onChange={(e) => setTicketId(e.target.value)}
            />
            <button onClick={buyTicket}>Buy Ticket</button>
          </div>

          <div className="box">
            <input 
              type="text" 
              placeholder="Enter Address"
              value={account}
              readOnly
            />
            <button onClick={getTicketNumber}>Ticket Id</button>
          </div>
        </div>

        <div className="row">
          <div className="box">
            <input 
              type="text" 
              placeholder="Enter Ticket Id/Address"
              value={swapTicketId}
              onChange={(e) => setSwapTicketId(e.target.value)}
            />
            <button onClick={offerSwap}>Offer Swap</button>
          </div>

          <div className="box">
            <input 
              type="text" 
              placeholder="Enter Ticket Id/Address"
              value={acceptSwapId}
              onChange={(e) => setAcceptSwapId(e.target.value)}
            />
            <button onClick={acceptSwap}>Accept Swap</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;