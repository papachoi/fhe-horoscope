import React, { useState } from 'react';
import { ethers } from 'ethers';
import { encryptFHE } from './utils/fheUtils';

// Replace this with the deployed address after you run a real deploy script
const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";
const ABI = [
  "function makeVec(bytes32 x) external pure returns (bytes32)",
  "function predictHoroscope(bytes32 dob, bytes32 color, bytes32 licenseCode) external returns (uint256)"
];

export default function App() {
  const [dob, setDob] = useState('');
  const [color, setColor] = useState('#000000');
  const [license, setLicense] = useState('');
  const [prediction, setPrediction] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.ethereum) return alert("Please install MetaMask");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    // "Encrypt" (placeholder) -> bytes32
    const dobHash = encryptFHE(dob.trim());
    const colorHash = encryptFHE(color);
    const licHash = encryptFHE(license.trim());

    try {
      // Wrap to FHEVector-compatible bytes32 (same today)
      const dobV = await contract.makeVec(dobHash);
      const colorV = await contract.makeVec(colorHash);
      const licV = await contract.makeVec(licHash);

      const tx = await contract.predictHoroscope(dobV, colorV, licV);
      const rc = await tx.wait();
      // Return value surfaced in receipt on some chains; for safety, do a static call too:
      let out;
      try {
        out = await contract.predictHoroscope.staticCall(dobV, colorV, licV);
      } catch {
        const ev = rc.logs?.find(l => l.fragment?.name === "Predicted");
        out = ev?.args?.[1];
      }
      setPrediction(out?.toString?.() ?? String(out));
    } catch (err) {
      console.error(err);
      alert("Tx failed, see console");
    }
  };

  return (
    <div style={{maxWidth: 560, margin: "40px auto", fontFamily: "Inter, system-ui"}}>
      <h1>Private FHE Horoscope (Prototype)</h1>
      <p style={{opacity:.7, marginTop:-8}}>Placeholder encryption today — swap in Zama FHEVM SDK later.</p>
      <form onSubmit={handleSubmit} style={{display:"grid", gap:12, marginTop:20}}>
        <label> Date of Birth (YYYYMMDD)
          <input value={dob} onChange={e=>setDob(e.target.value)} required />
        </label>
        <label> Favorite Color
          <input type="color" value={color} onChange={e=>setColor(e.target.value)} required />
        </label>
        <label> Car License Code
          <input value={license} onChange={e=>setLicense(e.target.value)} required />
        </label>
        <button type="submit">Get Prediction</button>
      </form>
      {prediction && (
        <div style={{marginTop:16, padding:12, border:"1px solid #eee", borderRadius:8}}>
          <h2>Your Horoscope Prediction: {prediction}</h2>
          <p style={{opacity:.7}}>(1..100 range; will be decrypted from FHE output later)</p>
        </div>
      )}
    </div>
  );
}
