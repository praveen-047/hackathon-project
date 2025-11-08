// src/components/MiniPreview.jsx
import React from "react";

const A4 = { W: 850, H: 1100 };
const SCALE = 0.38; // thumbnail scale
const THUMB_H = Math.round(A4.H * SCALE); // ~418

function MiniPreview({ children }) {
  return (
    <div
      style={{
        width: "100%",
        height: `${THUMB_H + 10}px`,
        background: "rgba(255,255,255,0.05)",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.15)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          transform: `scale(${SCALE})`,
          transformOrigin: "top center",
          width: A4.W,
        }}
      >
        <div
          style={{
            width: A4.W,
            minHeight: A4.H,
            background: "#fff",
            color: "#000",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default MiniPreview;
