import { useState, useEffect } from "react";
import Web3 from "web3";
import Test from "./contracts/Test.json";
import Ticket from "./contracts/Ticket.json";
/* global BigInt */

function App() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [uid, setuid] = useState("");
  const [eid, seteid] = useState("");

  const [tid, settid] = useState("");

  useEffect(() => {
    const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");

    const template = async () => {
      const web3 = new Web3(provider);

      //!To interact with the smart contract we need:
      //! 1) ABI
      //! 2) Contract Address
      const networkid = await web3.eth.net.getId();
      const deployed = await Ticket.networks[networkid];

      // INSTANCE OF CONTRACT TO MAKE INTERACTION
      const contract = new web3.eth.Contract(Ticket.abi, deployed.address);

      setState({ web3: web3, contract: contract });
    };
    provider && template();
  }, []);

  const createTicket = async (_eid, _uid) => {
    const { contract } = state;
    await contract.methods.createTicket(_eid, _uid).send({
      from: "0xB5c668A63b1C7f41A88530c562E23B54717bCfa8",
      gas: 500000,
    });
    window.location.reload();
  };

  const getTickets = async (_uid) => {
    const { contract } = state;
    const res = await contract.methods.getTicketsByUser(_uid).call();
    console.log(res);
  };

  const getTicketData = async (_tid) => {
    const { contract } = state;
    const res = await contract.methods.getTicketDetails(_tid).call();
    console.log(res);
  };

  return (
    <div className="App">
      <input
        type="text"
        placeholder="User id"
        onChange={(e) => setuid(e.target.value)}
      />
      <input
        type="text"
        placeholder="Event id"
        onChange={(e) => seteid(e.target.value)}
      />

      <button onClick={() => createTicket(eid, uid)}>Create ticket</button>

      <h1>Tickets</h1>

      <input
        type="text"
        placeholder="User id"
        onChange={(e) => setuid(e.target.value)}
      />
      <button onClick={() => getTickets(uid)}>Get tickets</button>

      <h1>Get Ticket details</h1>
      <input
        type="text"
        placeholder="ticket id"
        onChange={(e) => settid(e.target.value)}
      />
      <button onClick={() => getTicketData(tid)}>Get Details</button>
    </div>
  );
}

export default App;
