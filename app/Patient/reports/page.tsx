"use client";

import { useEffect, useState } from "react";
import { myReports, Report } from "@/lib/api";
import Card from "@/components/ui/Card";

export default function ReportsPage() {
  const [list, setList] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    myReports()
      .then(setList)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--muted)", paddingTop: 60, textAlign: "center" }}>Loading…</div>;
  if (err) return <div style={{ color: "var(--danger)", paddingTop: 20 }}>{err}</div>;

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>My Reports</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>{list.length} records found</p>
      </div>

      {list.length === 0 ? (
        <Card><p style={{ fontSize: 14, color: "var(--muted)", textAlign: "center" }}>No reports yet.</p></Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {list.map((r) => (
            <Card key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Medical Report</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.date}</div>
              </div>
              {[
                { label: "Diagnosis", value: r.diagnosis },
                { label: "Tests", value: r.tests },
                { label: "Remarks", value: r.remarks },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 14 }}>{item.value || "—"}</div>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
