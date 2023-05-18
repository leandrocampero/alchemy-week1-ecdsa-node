import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

/**
 * In order to secure a trasnfer, I should send along with the publicKey, recipient and amount,
 * a hashed message (the string of the transfer data object) and the signed message
 * and the server should verify the transaccion with the data received
 */
function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const txData = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient: recipient,
    };

    const hash = toHex(keccak256(utf8ToBytes(JSON.stringify(txData))));

    const signature = secp256k1.sign(hash, privateKey);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        hash,
        signature: {
          r: signature.r.toString(),
          s: signature.s.toString(),
          recovery: signature.recovery,
        },
      });
      setBalance(balance);
    } catch (ex) {
      console.error(ex);
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
