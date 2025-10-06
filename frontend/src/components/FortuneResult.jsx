import React from "react";

/**
 * Simple card-style component to display the user's fortune.
 * Props:
 *   - number: numeric prediction (1–100)
 *   - message: fortune text from getHoroscopeMessage()
 */
export default function FortuneResult({ number, message }) {
  if (!number) return null;

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "20px",
        borderRadius: "12px",
        background:
          "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(0, 0, 0, 0.05))",
        border: "1px solid #ddd",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
        fontFamily: "Inter, system-ui"
      }}
    >
      <h2>Your Fortune</h2>
      <p style={{ fontSize: "18px", margin: "6px 0", opacity: 0.7 }}>
        Number: <strong>{number}</strong>
      </p>
      <p style={{ fontSize: "22px", fontWeight: 600 }}>{message}</p>
    </div>
  );
}
