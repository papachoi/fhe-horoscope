/** Minimal AES-GCM helpers + keccak proof (mock privacy) **/

// Utility: bytes/hex/base64
const toHex = (u8) => "0x" + Array.from(u8).map(b=>b.toString(16).padStart(2,"0")).join("");
const fromHex = (hex) => new Uint8Array((hex.startsWith("0x")?hex.slice(2):hex).match(/.{2}/g).map(h=>parseInt(h,16)));

// AES-GCM with fixed zero IV (demo only; do NOT use in production)
const iv = new Uint8Array(12); // 96-bit all zeros

async function importKeyRaw(keyStr) {
  const keyBytes = new TextEncoder().encode(keyStr.padEnd(32,"!")).slice(0,32);
  return crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["encrypt","decrypt"]);
}

export async function encryptToHex(plaintext, keyStr) {
  const k = await importKeyRaw(keyStr);
  const pt = new TextEncoder().encode(plaintext);
  const ct = new Uint8Array(await crypto.subtle.encrypt({name:"AES-GCM", iv}, k, pt));
  return toHex(ct);
}

export async function decryptFromHex(cipherHex, keyStr) {
  const k = await importKeyRaw(keyStr);
  const ct = fromHex(cipherHex);
  const pt = new Uint8Array(await crypto.subtle.decrypt({name:"AES-GCM", iv}, k, ct));
  return new TextDecoder().decode(pt);
}

// Simple zodiac + message
export function getZodiac(isoDate /* YYYY-MM-DD */) {
  const [, m, d] = isoDate.split("-").map(Number);
  if ((m===3 && d>=21) || (m===4 && d<=19)) return "Aries";
  if ((m===4 && d>=20) || (m===5 && d<=20)) return "Taurus";
  if ((m===5 && d>=21) || (m===6 && d<=20)) return "Gemini";
  if ((m===6 && d>=21) || (m===7 && d<=22)) return "Cancer";
  if ((m===7 && d>=23) || (m===8 && d<=22)) return "Leo";
  if ((m===8 && d>=23) || (m===9 && d<=22)) return "Virgo";
  if ((m===9 && d>=23) || (m===10 && d<=22)) return "Libra";
  if ((m===10 && d>=23) || (m===11 && d<=21)) return "Scorpio";
  if ((m===11 && d>=22) || (m===12 && d<=21)) return "Sagittarius";
  if ((m===12 && d>=22) || (m===1 && d<=19)) return "Capricorn";
  if ((m===1 && d>=20) || (m===2 && d<=18)) return "Aquarius";
  if ((m===2 && d>=19) || (m===3 && d<=20)) return "Pisces";
  return "Unknown";
}

export function generateHoroscope(zodiac, timestamp, blockNum) {
  const date = new Date(timestamp * 1000).toDateString();
  const luck = blockNum % 12;
  return `${zodiac} on ${date} (Block ${blockNum}): Luck ${luck}/12 — DYOR ✨`;
}

/** keccak256(abi.encodePacked(...)) using ethers in the page (Remix has it loaded) */
export async function keccakPackedHex(args) {
  // args can be (hex string | number) — we’ll ABI-pack as bytes/uint
  const { ethers } = window;
  const types = args.map((a) => (typeof a === "number" ? "uint256" : "bytes"));
  const values = args.map((a) => a);
  const packed = ethers.AbiCoder.defaultAbiCoder().encode(types, values);
  return ethers.keccak256(packed);
}
