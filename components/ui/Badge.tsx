"use client";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  waiting:     { bg: "#fef9c3", color: "#92400e" },
  "in-progress": { bg: "#dbeafe", color: "#1d4ed8" },
  done:        { bg: "#dcfce7", color: "#166534" },
  skipped:     { bg: "#fde8e8", color: "#991b1b" },
  queued:      { bg: "#e0e7ff", color: "#3730a3" },
  admin:       { bg: "#f0fdf4", color: "#15803d" },
  patient:     { bg: "#eff6ff", color: "#1d4ed8" },
  receptionist:{ bg: "#fdf4ff", color: "#7e22ce" },
  doctor:      { bg: "#fff7ed", color: "#c2410c" },
};

interface Props {
  label: string;
  type?: string;
}

export default function Badge({ label, type }: Props) {
  const key = type || label.toLowerCase().replace(" ", "_");
  const style = STATUS_COLORS[key] || { bg: "#f1f5f9", color: "#475569" };
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        padding: "2px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 600,
        textTransform: "capitalize",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {label.replace("_", " ")}
    </span>
  );
}
