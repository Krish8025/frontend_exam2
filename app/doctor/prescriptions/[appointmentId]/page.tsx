"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addPrescription, PrescriptionMedicine } from "@/lib/api";
import Card from "@/components/ui/Card";

export default function AddPrescriptionPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const router = useRouter();
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([{ name: "", dosage: "", duration: "" }]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState("");

  function addRow() {
    setMedicines((m) => [...m, { name: "", dosage: "", duration: "" }]);
  }

  function removeRow(i: number) {
    setMedicines((m) => m.filter((_, idx) => idx !== i));
  }

  function updateRow(i: number, field: keyof PrescriptionMedicine, value: string) {
    setMedicines((m) => m.map((row, idx) => idx === i ? { ...row, [field]: value } : row));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await addPrescription(appointmentId, medicines, notes);
      setSuccess(true);
      setTimeout(() => router.push("/doctor"), 1400);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to save prescription");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ maxWidth: 480 }}>
        <Card style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 40 }}>✅</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 10 }}>Prescription Saved!</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>Returning to queue…</p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <button
        onClick={() => router.back()}
        style={{ fontSize: 13, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 20 }}
      >
        ← Back to Queue
      </button>

      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Add Prescription</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>
          Appointment: <code style={{ fontSize: 12 }}>{appointmentId}</code>
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Medicines */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <label style={{ fontSize: 14, fontWeight: 600 }}>Medicines</label>
              <button
                type="button"
                onClick={addRow}
                style={{ fontSize: 12, color: "var(--primary)", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
              >
                + Add Row
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {medicines.map((m, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    value={m.name}
                    onChange={(e) => updateRow(i, "name", e.target.value)}
                    placeholder="Medicine name (e.g. Paracetamol)"
                    required
                    style={{ flex: 2, border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}
                  />
                  <input
                    value={m.dosage}
                    onChange={(e) => updateRow(i, "dosage", e.target.value)}
                    placeholder="Dosage (e.g. 500mg)"
                    required
                    style={{ flex: 1.5, border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}
                  />
                  <input
                    value={m.duration}
                    onChange={(e) => updateRow(i, "duration", e.target.value)}
                    placeholder="Duration (e.g. 5 days)"
                    required
                    style={{ flex: 1.5, border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}
                  />
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      style={{ color: "var(--danger)", background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "4px 6px" }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: 14, fontWeight: 600, display: "block", marginBottom: 8 }}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional instructions for the patient…"
              rows={3}
              style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", fontSize: 13, resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

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
              {loading ? "Saving…" : "Save Prescription"}
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
