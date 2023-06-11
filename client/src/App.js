import { useState, useEffect } from "react";
import Web3 from "web3";
import Test from "./contracts/Test.json";
/* global BigInt */

function App() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [a, setA] = useState(0);
  const [temp, setTemp] = useState("");

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

    const template = async () => {
      const web3 = new Web3(provider);

      //!To interact with the smart contract we need:
      //! 1) ABI
      //! 2) Contract Address
      const networkid = await web3.eth.net.getId();
      const deployed = await Test.networks[networkid];

      // INSTANCE OF CONTRACT TO MAKE INTERACTION
      const contract = new web3.eth.Contract(Test.abi, deployed.address);

      setState({ web3: web3, contract: contract });
    };
    provider && template();
  }, []);

  useEffect(() => {
    const { contract } = state;
    const readData = async () => {
      const res = await contract.methods.getA().call();
      setA(`${res}`);
    };
    contract && readData();
  }, [state]);

  const updateData = async (val) => {
    const { contract } = state;
    await contract.methods
      .setA(val)
      .send({ from: "0xB5c668A63b1C7f41A88530c562E23B54717bCfa8" });
    window.location.reload();
  };

  return (
    <div className="App">
      <h1>Value : {a}</h1>

      <input
        type="text"
        placeholder="Enter value"
        onChange={(e) => setTemp(e.target.value)}
      />

      <button onClick={() => updateData(temp)}>Update</button>
    </div>
  );
}

export default App;
