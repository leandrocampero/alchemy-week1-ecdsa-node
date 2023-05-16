const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const { toHex } = require("ethereum-cryptography/utils.js");

// Generate 10 wallet addresses
const LOOP_SIZE = 10;

for (let index = 0; index < LOOP_SIZE; index++) {
  console.log(`Account Nº${index}`);

  const privateKey = secp256k1.utils.randomPrivateKey();
  console.log(`Private Key: ${toHex(privateKey)}`);

  const publicKey = secp256k1.getPublicKey(privateKey);
  console.log(`Public Key: ${toHex(publicKey)}`);

  const address = toHex(publicKey).slice(-10);
  console.log(`Address: 0x${address}\n`);
}

/**
 * Account Nº0: 0x8300c3a374
 * Account Nº1: 0x07ea5f0dc3
 * Account Nº2: 0x3e0e99a3b0
 * Account Nº3: 0xb26064c9c1
 * Account Nº4: 0x46f93c14dc
 * Account Nº5: 0x03efdb2109
 * Account Nº6: 0x80d89a1043
 * Account Nº7: 0x1b7fd37b99
 * Account Nº8: 0x23aa72568a
 * Account Nº9: 0xbcc60f62f5
 */
