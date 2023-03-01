import React, { useState } from "react";
import "./App.css";
import { ethers, SocketProvider } from "ethers";
import contractAbi from "./contractAbi.json";

function App() {

  const [message, setMessage] = useState('');
  const [userBalance, setUserBalance] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [erc20Bal, setErc20Bal] = useState(null);
  const [erc20Taddy, setErc20Taddy] = useState('');
  const [erc20Taddy1, setErc20Taddy1] = useState('');
  const [txHash, setTxHash] = useState('');
  const [recieverAddy, setRecieverAddy] = useState('');
  const [amt, setAmt] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [txHash1, setTxHash1] = useState('');
  const [gasUsed, setGasUsed] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [fromAddress, setFromAddress] = useState('');

  // metamask wallet connect
  const connectWallet = async () => {
    if (window.ethereum) { // to detect etherrum provider
      try {
        const accounts = await window.ethereum.request({ // this request connection to metamask
          method: "eth_requestAccounts",
        });
        setDefaultAccount(accounts[0]); // this sets def acc to ac address.
        console.log(defaultAccount); // just to confirm if correct address is coming.
        console.log(typeof defaultAccount); // just to confirm what is returned to us
      } catch (err) {                          // error here means problem while connecting
        console.error(err);
        setMessage("problem connecting to MetaMask");
      }
    } else {
      setMessage("Please Install MetaMask");
    }
  }

  // this funciton will return eth balance
  const Balance = async () => {
    const balance = await window.ethereum.request({ method: 'eth_getBalance', params: [defaultAccount, 'latest'] });
    console.log(ethers.utils.formatEther(balance));
    setUserBalance(ethers.utils.formatEther(balance));
  }


  const erc20Balance = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    await provider.send("eth_requestAccounts", []);

    const signer = provider.getSigner();

    const contract = new ethers.Contract(erc20Taddy1, contractAbi, signer);
    const balance = await contract.balanceOf(defaultAccount);

    setErc20Bal(ethers.utils.formatEther(balance,18));
    console.log(ethers.utils.formatEther(balance));
  }

  const erc20Transfer = async () => {

    //setErc20Taddy("0x326C977E6efc84E512bB9C30f76E30c160eD06FB");
    //setRecieverAddy("0xc0AE337e367FF5B8eF737d514523760F317b80A5");

    console.log(erc20Taddy);
    console.log(recieverAddy);
    console.log(amt);
    setTxStatus("transaction started...");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    await provider.send("eth_requestAccounts", []);
    const contract = new ethers.Contract(erc20Taddy, contractAbi, signer);

    const amount = ethers.utils.parseUnits(amt, 18);

    try {
      const tx = await contract.transfer(recieverAddy, amount);
      await tx.wait();
      setTxHash(tx.hash);
      setTxStatus("Successfulll..");
    } catch (err) {
      console.error(err);
      setTxStatus("failed.. please check if your amount is right. ", err.message);
    }

  }

  const transactionDetail = async () => {
    console.log(txHash1);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const receipt = await provider.getTransaction(txHash1);
    console.log(receipt);

    setGasUsed(ethers.utils.formatUnits(receipt.gasPrice, "gwei"));
    setBlockNumber(receipt.blockNumber);
    setConfirmation(receipt.confirmations);
    setFromAddress(receipt.from);
  }

  const transactionLogs = async () => {

  }

  return (
    <div 
      style={{
        backgroundImage: `url("https://www.etsy.com/img/16065431/r/il/ff5729/3363529969/il_fullxfull.3363529969_r8xx.jpg")` ,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}>
      <div
        style={{
          paddingTop: '2rem',
          paddingLeft: '80rem',
          backgroundColor: 'black',
          width: '100vw',
          height: '10vh'
        }}>
        <button onClick={() => connectWallet()}>Connect Wallet</button>
      </div>

      <div
        style={{
          paddingTop: '2rem',
          paddingBottom: '2rem',
          paddingLeft: '42rem',
        }}>
        <button onClick={() => Balance()}>Get Balance</button>
        <div style={{ paddingTop: "1rem" }}>ETH Balance: {userBalance}</div>
      </div>

      <div
        style={{
          paddingTop: '2rem',
          paddingBottom: '2rem',
          paddingLeft: '36rem',
        }}>
        <input value={erc20Taddy1} placeholder="token addy" type="text" onChange={(e) => setErc20Taddy1(e.target.value)} />
        <button onClick={() => erc20Balance()}>Get ERC0 Token Balance</button>
        <div style={{ paddingTop: "1rem" }}>
          Token Balance: {erc20Bal}
        </div>

      </div>

      <div
        style={{
          paddingTop: '2rem',
          paddingBottom: '2rem',
          paddingLeft: '36rem',
        }}>
        <input value={erc20Taddy} placeholder="token addy" type="text" onChange={(e) => setErc20Taddy(e.target.value)} />
        <input value={recieverAddy} placeholder="reciever addy" type="text" onChange={(e) => setRecieverAddy(e.target.value)} />
        <input value={amt} placeholder="token amt" type="text" onChange={(e) => setAmt(e.target.value)} />
        <button style={{elevation: 3}} onClick={() => erc20Transfer()}>transfer ERC20 token</button>
        <div style={{ paddingTop: "1rem" }}>
          Transaction Status : {txStatus}
        </div>
        <div style={{ paddingTop: "1rem" }}>
          Transaction Hash : {txHash}
        </div>
      </div>

      <div
        style={{
          paddingTop: '2rem',
          paddingBottom: '2rem',
          paddingLeft: '36rem',
        }}>
        <input value={txHash1} placeholder="txn hash" type="text" onChange={(e) => setTxHash1(e.target.value)} />
        <button onClick={() => transactionDetail()}>Get txn details</button>
        <div style={{ paddingTop: "1rem" }}>
          Gas Used: {gasUsed}
        </div>
        <div style={{ paddingTop: "1rem" }}>
          Block Number: {blockNumber}
        </div>
        <div style={{ paddingTop: "1rem" }}>
          Confirmations: {confirmation}
        </div>
        <div style={{ paddingTop: "1rem" }}>
          From Address: {fromAddress}
        </div>
      </div>
    </div>
  )
}
export default App;