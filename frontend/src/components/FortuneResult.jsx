import React, { useEffect, useState } from "react";

/**
 * Simple card-style component to display the user's fortune.
 * Props:
 *   - number: numeric prediction (1–100)
 *   - message: fortune text from getHoroscopeMessage()
 */
export default function FortuneResult({ number, message }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (number) {
      // trigger fade-in a bit after mount
      const timer = setTimeout(() => setVisible(true), 50);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [number]);

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
        fontFamily: "Inter, system-ui",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.6s ease, transform 0.6s ease"
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
