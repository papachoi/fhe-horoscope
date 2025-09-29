# Private FHE Horoscope dApp

This is a prototype that mimics an FHE flow now and is **FHEVM-ready**:
- Client "encrypts" inputs (placeholder hashing today).
- Smart contract combines inputs and returns a deterministic prediction in [1..100].
- Later: swap hashing with **Zama FHEVM client encryption** and return **encrypted handle**; add oracle decrypt callback.

## Stack
- Contracts: Solidity 0.8.24, Hardhat, ethers v6.
- Frontend: React + ethers.

## How to run (contracts)
```sh
npm i
npx hardhat test
How to run (frontend)

Create a React app (Vite/CRA), drop src/App.js and src/utils/fheUtils.js in, set:
REACT_APP_CONTRACT_ADDRESS=0xDeployedAddress
then:
npm i ethers
npm run dev
Upgrade to real FHEVM

Replace encryptFHE with Zama’s FHE client SDK → produce valid encrypted inputs.

Change contract types to FHEVM encrypted types/handles and call proper ops.

Add an oracle/Gateway callback to decrypt on-chain with signature verification.
