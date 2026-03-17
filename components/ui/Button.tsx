"use client";

import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  size?: "sm" | "md";
}

export default function Button({
  variant = "primary",
  loading = false,
  size = "md",
  children,
  disabled,
  ...props
}: Props) {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    borderRadius: "8px",
    fontWeight: 500,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.65 : 1,
    transition: "background 0.15s, opacity 0.15s",
    fontSize: size === "sm" ? "13px" : "14px",
    padding: size === "sm" ? "6px 14px" : "9px 20px",
  };

  const styles: Record<string, React.CSSProperties> = {
    primary: { ...base, background: "var(--primary)", color: "#fff" },
    secondary: { ...base, background: "var(--border)", color: "var(--text)" },
    danger: { ...base, background: "var(--danger)", color: "#fff" },
    ghost: { ...base, background: "transparent", color: "var(--primary)", padding: size === "sm" ? "6px 10px" : "9px 14px" },
  };

  return (
    <button style={styles[variant]} disabled={disabled || loading} {...props}>
      {loading && <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />}
      {children}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
