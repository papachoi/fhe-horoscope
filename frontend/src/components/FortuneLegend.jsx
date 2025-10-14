import React from "react";
import { getFortuneTheme } from "../utils/fortuneTheme";

/**
 * Displays a compact legend for fortune types (emoji + word + color)
 */
export default function FortuneLegend() {
  const fortunes = [
    "win",
    "luck",
    "love",
    "wealth",
    "health",
    "learn",
    "travel",
    "create",
    "connect",
    "focus"
  ];

  return (
    <div
      style={{
        marginTop: "30px",
        padding: "10px",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        fontSize: "14px",
        textAlign: "center",
        fontFamily: "Inter, system-ui"
      }}
    >
      <p style={{ marginBottom: "8px", fontWeight: 600 }}>✨ Fortune Legend</p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px"
        }}
      >
        {fortunes.map((key) => {
          const { emoji, color } = getFortuneTheme(key);
          return (
            <span
              key={key}
              title={key}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                color,
                border: `1px solid ${color}44`,
                borderRadius: "8px",
                padding: "2px 6px"
              }}
            >
              <span>{emoji}</span>
              <span>{key}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
