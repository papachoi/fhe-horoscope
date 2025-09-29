// Placeholder "encryption": hash input to bytes32.
// Swap this later with Zama FHEVM client-side encryption (SDK) to produce a valid handle.
import { keccak256, toUtf8Bytes } from "ethers";

export function encryptFHE(data) {
  return keccak256(toUtf8Bytes(String(data)));
}
