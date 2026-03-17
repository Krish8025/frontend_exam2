"use client";

import { useEffect, useState } from "react";
import { myPrescriptions, Prescription } from "@/lib/api";
import Card from "@/components/ui/Card";

export default function PrescriptionsPage() {
  const [list, setList] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    myPrescriptions()
      .then(setList)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--muted)", paddingTop: 60, textAlign: "center" }}>Loading…</div>;
  if (err) return <div style={{ color: "var(--danger)", paddingTop: 20 }}>{err}</div>;

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>My Prescriptions</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>{list.length} records found</p>
      </div>

      {list.length === 0 ? (
        <Card><p style={{ color: "var(--muted)", fontSize: 14, textAlign: "center" }}>No prescriptions yet.</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {list.map((p) => (
            <Card key={p.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Prescription</div>
                  {p.doctorName && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Dr. {p.doctorName}</div>}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{p.date}</div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                <thead>
                  <tr style={{ background: "var(--bg)" }}>
                    <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 12, color: "var(--muted)" }}>Medicine</th>
                    <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 12, color: "var(--muted)" }}>Dosage</th>
                    <th style={{ padding: "6px 10px", textAlign: "left", fontSize: 12, color: "var(--muted)" }}>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {p.medicines.map((m, i) => (
                    <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                      <td style={{ padding: "7px 10px", fontSize: 13 }}>{m.name}</td>
                      <td style={{ padding: "7px 10px", fontSize: 13, color: "var(--muted)" }}>{m.dosage}</td>
                      <td style={{ padding: "7px 10px", fontSize: 13, color: "var(--muted)" }}>{m.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {p.notes && (
                <div style={{ fontSize: 13, color: "var(--muted)", borderTop: "1px solid var(--border)", paddingTop: 10 }}>
                  <b>Notes:</b> {p.notes}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
