import { secp256k1 as scep } from "ethereum-cryptography/secp256k1.js";
import server from "./server";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    
    if (privateKey.length == 64) {
      const publicKey = scep.getPublicKey(privateKey)
      const address = `0x${toHex(publicKey).slice(-10)}`

      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
      setAddress(address)
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type your private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div className="balance">Address: {address}</div>
      
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
