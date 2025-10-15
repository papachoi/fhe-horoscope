# Remix Playbook — Private Horoscope (No .env, No scripts)

## Prereqs
- Rabby/MetaMask on Sepolia (ChainId 11155111). Fund burner via faucet.
- Open https://remix.ethereum.org in a secure (https) tab.

## A) Deploy
1) New file: `contracts/HoroscopeCoordinator.sol` (paste from repo).
2) Compile with 0.8.20.
3) Deploy: "Injected Provider - MetaMask". Confirm in wallet.

## B) Client (User) — Encrypt DOB → submitRequest
Open browser console (F12). Paste the helpers from `scripts/console/crypto-helpers.js` then:

```js
const birthDate = "1990-05-15";                 // YYYY-MM-DD
const secretKey = "mysecretfhekey1234567890!!"; // remember this!
const ts = Math.floor(Date.now()/1000);
const blockNum = await window.ethereum.request({ method: "eth_blockNumber" }).then(h=>parseInt(h,16));
// Encrypt DOB → hex bytes for Remix
const encryptedBDHex = await encryptToHex(birthDate, secretKey);
console.log({ ts, blockNum, encryptedBDHex });
In Remix (Deployed Contracts):

submitRequest(_encryptedBD, _timestamp, _blockNum)

_encryptedBD: paste encryptedBDHex

_timestamp: ts

_blockNum: blockNum

Confirm tx → note ComputeRequested event id.

## C) Operator — Decrypt, compute, encrypt result → submitResult

In console:

const id = 0; // your request id from event
const decryptedBD = await decryptFromHex(encryptedBDHex, secretKey);
const zodiac = getZodiac(decryptedBD); // helper below
const horoscope = generateHoroscope(zodiac, ts, blockNum);

const encryptedResultHex = await encryptToHex(horoscope, secretKey);
const proof = await keccakPackedHex([encryptedBDHex, ts, blockNum, encryptedResultHex]);

console.log({ decryptedBD, zodiac, horoscope, encryptedResultHex, proof });


In Remix:

submitResult(id, encryptedResultHex, proof) → confirm → see ResultVerified.

## D) Client — Retrieve + decrypt

In Remix:

getEncryptedResult(id) (call) → copy hex.

Console:

const finalText = await decryptFromHex(RESULT_HEX_FROM_CONTRACT, secretKey);
console.log("Final Private Horoscope:", finalText);

Helpers summary

AES-GCM mock encryption in the browser (privacy demo only; swap to FHE client SDK later).

keccakPackedHex() gives the exact proof the contract expects.

All keys stay in your wallet/browser; nothing leaves your machine.
