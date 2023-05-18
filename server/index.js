const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const balancesJSON = require("./balances.json");
const balances = Object.assign({}, balancesJSON);

const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const {
    sender,
    recipient,
    amount,
    hash,
    signature: { r, s, recovery },
  } = req.body;

  const signature = new secp256k1.Signature(BigInt(r), BigInt(s));
  signature.recovery = recovery;

  const recoveredPublicKey = signature.recoverPublicKey(hash).toRawBytes();

  const recoveredAddress = `0x${toHex(
    keccak256(recoveredPublicKey.slice(1)).slice(-20)
  )}`;

  const matchingAddresses = recoveredAddress === sender;
  //const isValid = secp256k1.verify(signature, hash, toHex(recoveredPublicKey));

  if (matchingAddresses) {
    res.status(400).send({ message: "Signature not verified" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
