// Simple helper to map a number (1–100) to its fortune message.
//
// Usage example:
//   import getHoroscopeMessage from "../utils/getHoroscopeMessage";
//   const msg = await getHoroscopeMessage(42);
//   console.log(msg); // "create" (for example)

import horoscope from "../../data/horoscope-100.json";

/**
 * Return the horoscope message for a given number.
 * @param {number|string} num - number between 1 and 100
 * @returns {string} fortune text
 */
export default async function getHoroscopeMessage(num) {
  const n = parseInt(num);
  if (isNaN(n) || n < 1 || n > 100) return "unknown";
  return horoscope[n.toString()] || "unknown";
}
