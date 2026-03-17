"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDoctorQueue, DoctorQueueItem } from "@/lib/api";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  waiting:     { bg: "#fef9c3", color: "#92400e" },
  "in-progress": { bg: "#dbeafe", color: "#1d4ed8" },
  done:        { bg: "#dcfce7", color: "#166534" },
  skipped:     { bg: "#fee2e2", color: "#991b1b" },
};

export default function DoctorQueuePage() {
  const [queue, setQueue] = useState<DoctorQueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    getDoctorQueue()
      .then(setQueue)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--muted)", paddingTop: 60, textAlign: "center" }}>Loading queue…</div>;
  if (err) return <div style={{ color: "var(--danger)", paddingTop: 20 }}>{err}</div>;

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Today&apos;s Queue</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {queue.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "40px", textAlign: "center", color: "var(--muted)" }}>
          No patients in queue for today.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {queue.map((item) => {
            const sc = STATUS_COLORS[item.status] || { bg: "#f1f5f9", color: "#475569" };
            return (
              <div
                key={item.appointmentId}
                style={{
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: "14px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: "var(--shadow)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "#fff7ed",
                      color: "#c2410c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {item.token}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{item.patientName}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                      Appointment #{String(item.appointmentId).slice(0, 8)}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: sc.bg,
                      color: sc.color,
                      textTransform: "capitalize",
                    }}
                  >
                    {item.status.replace("_", " ")}
                  </span>
                  <Link
                    href={`/doctor/prescriptions/${item.appointmentId}`}
                    style={{
                      fontSize: 12,
                      background: "#ccfbf1",
                      color: "var(--primary)",
                      borderRadius: 7,
                      padding: "5px 12px",
                      fontWeight: 500,
                    }}
                  >
                    + Prescription
                  </Link>
                  <Link
                    href={`/doctor/reports/${item.appointmentId}`}
                    style={{
                      fontSize: 12,
                      background: "#e0e7ff",
                      color: "#3730a3",
                      borderRadius: 7,
                      padding: "5px 12px",
                      fontWeight: 500,
                    }}
                  >
                    + Report
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
