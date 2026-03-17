"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { appointmentDetails, Appointment } from "@/lib/api";
import Card from "@/components/ui/Card";

export default function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<Appointment & {
    prescription?: { medicines: { name: string; dosage: string; duration: string }[]; notes: string };
    report?: { diagnosis: string; tests: string; remarks: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    appointmentDetails(id)
      .then(setData)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ color: "var(--muted)", paddingTop: 60, textAlign: "center" }}>Loading…</div>;
  if (err) return <div style={{ color: "var(--danger)", paddingTop: 20 }}>{err}</div>;
  if (!data) return null;

  return (
    <div style={{ maxWidth: 640 }}>
      <button
        onClick={() => router.back()}
        style={{ fontSize: 13, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 20, display: "flex", alignItems: "center", gap: 4 }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Appointment Details</h1>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Date", value: data.date },
            { label: "Time Slot", value: data.timeSlot },
            { label: "Queue Token", value: data.queueToken ? `#${data.queueToken}` : "—" },
            { label: "Status", value: (data.queueStatus || data.status || "—").replace("_", " ") },
          ].map((item) => (
            <div key={item.label}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, textTransform: "capitalize" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {data.prescription ? (
        <Card style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>💊 Prescription</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 12, color: "var(--muted)" }}>Medicine</th>
                <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 12, color: "var(--muted)" }}>Dosage</th>
                <th style={{ padding: "8px 12px", textAlign: "left", fontSize: 12, color: "var(--muted)" }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {data.prescription.medicines.map((m, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ padding: "8px 12px", fontSize: 13 }}>{m.name}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: "var(--muted)" }}>{m.dosage}</td>
                  <td style={{ padding: "8px 12px", fontSize: 13, color: "var(--muted)" }}>{m.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.prescription.notes && (
            <div style={{ fontSize: 13, color: "var(--muted)", borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              <b>Notes:</b> {data.prescription.notes}
            </div>
          )}
        </Card>
      ) : (
        <Card style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center" }}>No prescription added yet.</p>
        </Card>
      )}

      {data.report ? (
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>📄 Report</h3>
          {[
            { label: "Diagnosis", value: data.report.diagnosis },
            { label: "Tests", value: data.report.tests },
            { label: "Remarks", value: data.report.remarks },
          ].map((r) => (
            <div key={r.label} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>{r.label}</div>
              <div style={{ fontSize: 14 }}>{r.value || "—"}</div>
            </div>
          ))}
        </Card>
      ) : (
        <Card>
          <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center" }}>No report added yet.</p>
        </Card>
      )}
    </div>
  );
}
