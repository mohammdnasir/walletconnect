import './App.css';
import NodeWalletConnect from "@walletconnect/node";
import WalletConnectQRCodeModal from "@walletconnect/qrcode-modal";
import { useState } from 'react';
import Web3 from 'web3';
import {ethers, providers} from 'ethers';




// const web3 = new Web3("http://localhost:8545")

// const daiToken = new web3.eth.Contract(ERC20TransferABI, DAI_ADDRESS)
const walletConnector = new NodeWalletConnect(
  {
    bridge: "https://bridge.walletconnect.org", // Required
    // bridge: "http://metamask.io",
  },
  {
    clientMeta: {
      description: "WalletConnect NodeJS Client",
      url: "https://nodejs.org/en/",
      icons: ["https://nodejs.org/static/images/logo.svg"],
      name: "WalletConnect",
    },
  }
  );
 
    walletConnector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }
      window.location.reload();

    });
    walletConnector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
      window.location.reload("disconnect");
    });


    //ABI 

    const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"burn","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  
    function App() {
      
      const [wallletAccount , setWallletAccount] = useState('');
      // const [metamaskAccount, setMetamaskAccount] = useState(''); 
      const [contractInfo, setContractInfo] = useState();
      const [tokenName, setTokenName] = useState('');
      const [tokenSymbol, setTokenSymbol] = useState('');
      const[tokenDecimals, setTokenDecimals] = useState('');
      const[tokenTotalSupply, setTotalSupply] = useState('');
      const[tokenBalance, setTokenBalance] = useState('');
      const[tokenReceiver, setTokenReceiver] = useState('');
      const[tokenAmount, setTokenAmount] = useState('');
      const[defaultAccount, setDefaultAccount] = useState('')
     
    
      
      

  async function connectWallet() { 

    if (!walletConnector.connected) {
      // create new session
      walletConnector.createSession().then(() => {
        // get uri for QR Code modal
        const uri = walletConnector.uri;
        // display QR Code modal
        WalletConnectQRCodeModal.open(
          uri,
          () => {
            console.log("QR Code Modal closed");
          },
          true // isNode = true
        );
      });
    }

    walletConnector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
      
      // Close QR Code Modal
      WalletConnectQRCodeModal.close(
        true // isNode = true
        );
        const { accounts } = payload.params[0];
        console.log("on wallet connect",payload.params[0])
        setWallletAccount(accounts[0])
      });
      
      }

      // console.log( "wallet connect" , wallletAccount );
      const disconnect1 = () => {
        
          walletConnector.killSession("connected")
          window.location.reload();
      }

    
      const connectMetaMask = async () =>{
        // let tokenContrat;
        
        let provider = window.ethereum;
        
        if(typeof provider !=='undefined'){
    
          provider.request({ method: 'eth_requestAccounts' }).then(result =>{
            accountChangeHandler(result[0])
            // console.log(result[0]);
            // setMetamaskAccount(result[0]);
            
            alert("connected")
          }).catch(err => {
            console.log(err);
            alert("Not Connected")
          })
          
        }
        const accountChangeHandler = (newAccount) => {
          setDefaultAccount(newAccount);
          
        }
        
        provider.on('accountsChanged', accountChangeHandler);

        

        const web3 = new Web3(provider);
        
        const networkId = await web3.eth.net.getId();
        
        const tokenContract = new web3.eth.Contract(abi, 
          "0xE47cd1c32F45E90d87dd74102Ee41529a6F30372"); 
          console.log("contract is----------->",tokenContract);
          setContractInfo(tokenContract)
          
        }

        const disConnectMetaMask =  () =>{
          if(connectMetaMask !== ''){
            setDefaultAccount("")
            // console.log(setMetamaskAccount)
            alert("Disconnected MetaMask")
          }
          // window.location.reload()

        }
        
        // console.log("is full ---",wallletAccount);

        const getName = async (e) =>{
          
          e.preventDefault();
          // let data;
          var name=await contractInfo.methods.name().call();
          var bal =await contractInfo.methods.balanceOf(defaultAccount).call();
          var symbol= await contractInfo.methods.symbol().call();
          var decimals = await contractInfo.methods.decimals().call();
          var totalSupply =await contractInfo.methods.totalSupply().call();
         
          
            
          setTokenName(name);
          setTokenSymbol(symbol);
          setTokenDecimals(decimals);
          setTotalSupply(totalSupply);
          setTokenBalance(bal);
          // setTokenTransfer(send);
          
        };
        
        
        const handleTransfer = async (e) =>{
          e.preventDefault();
          // console.log("is not emty -", wallletAccount );
          var sum = tokenAmount*1000000000000000000;
          var Add = sum.toString()
          // var fromAcc = wallletAccount.toString()
          var recipientpt = await contractInfo.methods.transfer(tokenReceiver, Add).send({from : defaultAccount});
          console.log("receipt is ---------->",recipientpt);
        
        }

        // console.log("meta mask acc --",metamaskAccount);

        return (
          <div className="container-fluid">
      <div className='container'>
      {walletConnector.connected ? 
      <>
       <h2>Connect To</h2> 
        <p>
        {walletConnector.accounts[0]}      
        </p>
        <button onClick={disconnect1}>Disconnect</button><br/>
        </> 
      : 
      <>
      <h1>Wallet Connect</h1>
      <button  onClick={connectWallet}>Wallet Connect</button><br/><br/>
      </>
      }

  {defaultAccount !=='' ?
  <>
  <button onClick={disConnectMetaMask}> Disconnect To MetaMask</button><br/><br/> 
    <h2>Connect To</h2>
     <p>
     {defaultAccount}  
     </p>
  
  </>
  :
  <>
    <button onClick={connectMetaMask}>Connect To MetaMask</button><br/><br/> 
  </>
  }
 
        
 
    
    
      {/* <button onClick={callContract}>Test</button> */}
      <div className='container'>
      {/* <button onClick={getName}>Get Name</button><br/><br/>
      {tokenName == '' ? "" : tokenName} */}
      <form  onSubmit={getName}>
        {/* <h2>Read a Contract</h2> */}
        <input type="text" className='form-control' name="name"  value={tokenName} placeholder='Name'/><br/>
        <input type="text" className='form-control' name="symbol" value={tokenSymbol} placeholder='Symbol'/><br/>
        <input type="text" className='form-control' name="decimals" value={tokenDecimals} placeholder='Decimals'/><br/>
        <input type="text" className='form-control' name="totalSupply" value={tokenTotalSupply} placeholder='Total Supply'/><br/>
        <input type="text" className='form-control' value={tokenBalance} placeholder='Balance'/><br/>
        <button type='submit'>Submit</button><br/>
        </form>
        
        
        <form  onSubmit={handleTransfer}>
        <h2>Write a Contract</h2>
      <input type="text" className='form-control' onChange={e => setTokenReceiver(e.target.value)} value={tokenReceiver} placeholder='Receipt Address'/><br/>
      <input type="text" className='form-control' onChange={e => setTokenAmount(e.target.value)} value={tokenAmount} placeholder='Amount'/><br/>
      <button type='submit'>Transfer</button>
      </form>
      </div>   
        </div>
         </div>
      );
  }



  
export default App;



