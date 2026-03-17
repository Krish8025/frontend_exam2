"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { myAppointments, Appointment } from "@/lib/api";
import { getSession } from "@/lib/auth";
import Card from "@/components/ui/Card";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    queued:      { bg: "#e0e7ff", color: "#3730a3" },
    waiting:     { bg: "#fef9c3", color: "#92400e" },
    "in-progress": { bg: "#dbeafe", color: "#1d4ed8" },
    done:        { bg: "#dcfce7", color: "#166534" },
    skipped:     { bg: "#fee2e2", color: "#991b1b" },
  };
  const s = map[status] || { bg: "#f1f5f9", color: "#475569" };
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 600,
        padding: "2px 10px",
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        textTransform: "capitalize",
      }}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export default function PatientDashboard() {
  const user = getSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myAppointments()
      .then(setAppointments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--muted)", paddingTop: 60, textAlign: "center" }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Hello, {user?.name} 👋</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>
          Here are your appointments
        </p>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total", value: appointments.length },
          { label: "Upcoming", value: appointments.filter(a => ["queued", "waiting", "in-progress"].includes(a.status || "")).length },
          { label: "Done", value: appointments.filter(a => a.status === "done").length },
        ].map((s) => (
          <Card key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--primary)" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 28 }}>
        <Link
          href="/Patient/book"
          style={{
            display: "inline-block",
            background: "var(--primary)",
            color: "#fff",
            borderRadius: 8,
            padding: "9px 20px",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          + Book Appointment
        </Link>
      </div>

      {/* Appointments list */}
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Your Appointments</h2>
        {appointments.length === 0 ? (
          <Card>
            <p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center" }}>No appointments yet.</p>
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {appointments.map((a) => (
              <Card
                key={a.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px",
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{a.date}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                    Slot: {a.timeSlot}
                    {a.queueToken ? ` · Token #${a.queueToken}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <StatusBadge status={a.queueStatus || a.status || "queued"} />
                  <Link
                    href={`/Patient/appointments/${a.id}`}
                    style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500 }}
                  >
                    View →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
