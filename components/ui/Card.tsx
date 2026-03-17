"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export default function Card({ children, style, className }: Props) {
  return (
    <div
      className={className}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius)",
        boxShadow: "var(--shadow)",
        padding: "20px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
