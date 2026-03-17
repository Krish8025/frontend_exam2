"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addReport } from "@/lib/api";
import Card from "@/components/ui/Card";

export default function AddReportPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const router = useRouter();
  const [form, setForm] = useState({ diagnosis: "", tests: "", remarks: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState("");

  function handleChange(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await addReport(appointmentId, form.diagnosis, form.tests, form.remarks);
      setSuccess(true);
      setTimeout(() => router.push("/doctor"), 1400);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to save report");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ maxWidth: 480 }}>
        <Card style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 40 }}>✅</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>Report Saved!</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>Returning to queue…</p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 540 }}>
      <button
        onClick={() => router.back()}
        style={{ fontSize: 13, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 20 }}
      >
        ← Back to Queue
      </button>

      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Add Report</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>
          Appointment: <code style={{ fontSize: 12 }}>{appointmentId}</code>
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { field: "diagnosis", label: "Diagnosis", placeholder: "e.g. Viral fever" },
            { field: "tests", label: "Tests Ordered", placeholder: "e.g. CBC, LFT" },
            { field: "remarks", label: "Remarks", placeholder: "Additional clinical notes…" },
          ].map(({ field, label, placeholder }) => (
            <div key={field}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", display: "block", marginBottom: 5 }}>
                {label}
              </label>
              <textarea
                value={form[field as keyof typeof form]}
                onChange={(e) => handleChange(field, e.target.value)}
                placeholder={placeholder}
                rows={field === "remarks" ? 3 : 2}
                style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", fontSize: 13, resize: "vertical", fontFamily: "inherit" }}
              />
            </div>
          ))}

          {err && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: 8, padding: "9px 12px", fontSize: 13 }}>
              {err}
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 1, background: "var(--primary)", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 600, cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Saving…" : "Save Report"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/doctor")}
              style={{ padding: "10px 18px", border: "1px solid var(--border)", borderRadius: 8, background: "#fff", fontSize: 14, cursor: "pointer" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
