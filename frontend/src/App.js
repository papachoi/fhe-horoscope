import React, { useState } from "react";
import { ethers } from "ethers";
import { encryptFHE } from "./utils/fheUtils";
import getHoroscopeMessage from "./utils/getHoroscopeMessage";
import FortuneResult from "./components/FortuneResult";

function App() {
  const [dob, setDob] = useState("");
  const [color, setColor] = useState("#FF5733");
  const [license, setLicense] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // 🌟 new state

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous result + show loader
    setPrediction(null);
    setIsLoading(true);

    try {
      if (!window.ethereum) return alert("Install MetaMask");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
      const ABI = [
        "function makeVec(bytes32 x) external pure returns (bytes32)",
        "function predictHoroscope(bytes32 dob, bytes32 color, bytes32 licenseCode) external returns (uint256)",
        "event Predicted(address indexed user, uint256 prediction)"
      ];
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const dobH = encryptFHE(dob.trim());
      const colH = encryptFHE(color);
      const licH = encryptFHE(license.trim());

      const dobV = await contract.makeVec(dobH);
      const colV = await contract.makeVec(colH);
      const licV = await contract.makeVec(licH);

      const tx = await contract.predictHoroscope(dobV, colV, licV);
      const rc = await tx.wait();
      const out = await contract.predictHoroscope.staticCall(dobV, colV, licV);
      setPrediction(Number(out));
    } catch (err) {
      console.error("Error:", err);
      alert("Transaction failed or was rejected.");
    } finally {
      setIsLoading(false); // ✅ hide loader
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <h1>Private FHE Horoscope</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          type="text"
          placeholder="Date of Birth (yyyymmdd)"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Car License Code"
          value={license}
          onChange={(e) => setLicense(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Get Prediction"}
        </button>
      </form>

      {isLoading && (
        <p style={{ marginTop: 16, opacity: 0.7 }}>🔮 Calculating your fortune...</p>
      )}

      {prediction && (
        <FortuneResult
          number={prediction}
          message={await getHoroscopeMessage(prediction)}
        />
      )}
    </div>
  );
}

export default App;