// Use imports
// syntax only for this lesson
import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

// Check if window.ethereum exist
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    console.log("Metamask found");
    window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected!";
  } else {
    console.log("No MetaMask!");
    connectButton.innerHTML = "Please Install MetaMask";
  }
}

//get Balance function

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

//fund function

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}...`);
  if (typeof window.ethereum !== "undefined") {
    //need provider/connection similar to JSON RPC Provider
    //need signer and wallet
    //contract that we are interacting with: ABI & Address

    // provider line: looks at MetaMask and says I know the specified HTTP URL
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // return whichever account is connected
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txnResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      // listen for tx to be mined
      // listen for an event
      await listenForTransactionMine(txnResponse, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
}

// Purposely not async
function listenForTransactionMine(txnResponse, provider) {
  console.log(`Mining ${txnResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(txnResponse.hash, (txnReceipt) => {
      console.log(`Completed with ${txnReceipt.confirmations} confirmations`);
      resolve();
    });
  });
  //create listenter for txn on the Blockchain or for an event
  // trigger arrow function once txn hash happens
}

// withdraw button

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txnResponse = await contract.withdraw();
      // listen for tx to be mined
      // listen for an event
      await listenForTransactionMine(txnResponse, provider);
      console.log("Done!");
    } catch (error) {
      console.log(error);
    }
  }
}
