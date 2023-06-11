import { useState, useEffect } from "react";
import Web3 from "web3";
import Test from "./contracts/Test.json";
import Ticket from "./contracts/Ticket.json";
/* global BigInt */

function App() {
  const [state, setState] = useState({ web3: null, contract: null });
  const [uid, setuid] = useState("");
  const [eid, seteid] = useState("");

  function stoB32(inputString) {
    const encoder = new TextEncoder();
    const data = encoder.encode(inputString);
    const buffer = new Uint8Array(32);

    if (data.length >= buffer.length) {
      buffer.set(data.slice(0, buffer.length));
    } else {
      buffer.set(data);
    }

    return (
      "0x" +
      Array.prototype.map
        .call(buffer, (x) => ("00" + x.toString(16)).slice(-2))
        .join("")
    );
  }

  function tc(bytes32) {
    let str = "";
    for (let i = 0; i < bytes32.length; i++) {
      const charCode = bytes32[i];
      if (charCode !== 0) {
        str += String.fromCharCode(charCode);
      }
    }
    return str;
  }

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
    _eid = stoB32(_eid);
    _uid = stoB32(_uid);
    await contract.methods.createTicket(_eid, _uid).send({
      from: "0xB5c668A63b1C7f41A88530c562E23B54717bCfa8",
      gas: 500000,
    });
    window.location.reload();
  };

  const getTickets = async (_uid) => {
    const { contract } = state;
    _uid = stoB32(_uid);
    const res = await contract.methods.getTicketsByUser(_uid).call();
    // console.log(res.length != 0 ? res[0].ticketId : "No tickets found");
    res.map((r) => console.log(getTicketData(r.ticketId)));
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
