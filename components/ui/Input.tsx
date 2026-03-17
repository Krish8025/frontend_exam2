"use client";

import React from "react";

interface Props {
  label?: string;
  error?: string;
  style?: React.CSSProperties;
}

export default function Input({
  label,
  error,
  style,
  ...props
}: Props & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", ...style }}>
      {label && (
        <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--muted)" }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
          borderRadius: "8px",
          padding: "9px 12px",
          fontSize: "14px",
          background: "#fff",
          color: "var(--text)",
          width: "100%",
          transition: "border-color 0.15s",
        }}
      />
      {error && (
        <span style={{ fontSize: "12px", color: "var(--danger)" }}>{error}</span>
      )}
    </div>
  );
}
