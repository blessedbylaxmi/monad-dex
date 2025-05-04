import React, { useState } from 'react';
import { ethers } from 'ethers';

const App = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [ethBalance, setEthBalance] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
      const balance = await provider.getBalance(accounts[0]);
      setEthBalance(ethers.formatEther(balance));
    }
  };

  const getTokenBalance = async (tokenAddress: string) => {
    if (!walletAddress) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const tokenContract = new ethers.Contract(tokenAddress, [
      'function balanceOf(address owner) view returns (uint256)'
    ], signer);
    const balance = await tokenContract.balanceOf(walletAddress);
    setTokenBalance(ethers.formatUnits(balance, 18));
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>Simple DEX</h2>
      <button onClick={connectWallet}>Connect Wallet</button>
      <p>Wallet: {walletAddress}</p>
      <p>ETH Balance: {ethBalance}</p>
      <p>Token Balance: {tokenBalance}</p>
      <button onClick={() => getTokenBalance('0xYourTokenAddressHere')}>Check Token Balance</button>
    </div>
  );
};

export default App;
