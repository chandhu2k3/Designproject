import "./App.css";
import React, { useState, useEffect, useReducer, useContext } from "react";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { getAddress } from "ethers";
import PhoneNum from "./res/PhoneNum.png";
import Ilustration from "./res/Ilustration.png"
import OperationsPage from "./components/operations";
import { ChakraProvider } from "@chakra-ui/react";
import { ContractAddress } from './config.js';
import ContractAbi from './utils/Contract.json';
import { Appcontext } from "./components/context";


function App() {
  const { changeID, setChangeID, changeStatus, setChangeStatus } = useContext(Appcontext);
  const [currentAccount, setCurrentAccount] = useState(""); //fetched from metamask
  const [operations, setOperations] = useState([]); //fetched from smart contract

  //Ethereum Wallet Connector
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Metamask Not Found ! Get MetaMask and Try Again.");
        return;
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });
      const EthereumChainId = "0xaa36a7";
      if (chainId !== EthereumChainId) {
        alert("Please Connect to Ethereum Testnet");
        return;
      } else {
        // setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  function copyPhoneNumberToClipboard() {
    const phoneNumber = "+12707704034";
    navigator.clipboard.writeText(phoneNumber)
      .then(() => {
        window.alert("Copied phone number to clipboard!");
      })
      .catch((error) => {
        window.alert("Could not copy phone number to clipboard.");
        console.error(error);
      });
  }

  function openInNewTab() {
    var win = window.open('https://metamask.io', '_blank');
    win.focus();
  }

  const getEmergencies = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        //setting up provider
        const provider = new Web3Provider(ethereum);
        const signer = provider.getSigner();
        const MyContract = new ethers.Contract(ContractAddress, ContractAbi.abi, signer);
        //calling the smart contract
        let Em_Data = await MyContract.getOperations();
        const formattedOperations = Em_Data.map((operationData) => {
          return {
            id: parseInt(operationData.id),
            data: operationData.data,
            status: parseInt(operationData.status),
          };
        });

        const res = formattedOperations.map((operationObject) => {

          return {
            id: operationObject.id,
           
            data:operationObject.data,
            status: operationObject.status,
          };
        });
       
        setOperations(res);
        console.log(operations);
      }
      else {
        console.log('Ethereum object not found');
      }
    } catch (error) {
      console.log(error);
      alert("Dear Judge : You are not whitelisted , use the EthConnector.py in server folder to whitelist your Ethereum wallet address, The data of people's emergancy is very sensetiv and hence everyone should not have access to it :)");
    }
  }
  useEffect(() => {
    if (changeID !== false) {
      const updateStatus = async () => {
        console.log(changeID, changeStatus);
        try {
          const { ethereum } = window;
          if (ethereum) {
            //setting up provider
            const provider = new Web3Provider(ethereum);
            const signer = provider.getSigner();
            const MyContract = new ethers.Contract(ContractAddress, ContractAbi.abi, signer);
            //calling the smart contract
            console.log(MyContract);
            MyContract.setStatus(changeID, changeStatus).then(
              response => {
                console.log('Response : ', response);
                getEmergencies();
                setChangeStatus(false);
                setChangeID(false);
              }
            ).catch(err => {
              console.log(err);
            });

          }
          else {
            console.log('Ethereum object not found');
          }
        } catch (error) {
          console.log(error);
        }
      }
      updateStatus();
    }
  }, [changeID, changeStatus])

  useEffect(() => {
    connectWallet();
    getEmergencies();
  }, [ currentAccount]);


  return (
    
        <div className="Main">
          <ChakraProvider>
            <OperationsPage operationsData={operations} />
          </ChakraProvider>
        </div>
      
    
  );
}

export default App;
