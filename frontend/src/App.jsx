const submit = async (e) => {
  e.preventDefault();

  // 🔄 Reset previous result
  setPrediction(null);

  if (!window.ethereum) return alert("Install MetaMask");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const dobH = encryptFHE(dob.trim());
  const colH = encryptFHE(color);
  const licH = encryptFHE(license.trim());
