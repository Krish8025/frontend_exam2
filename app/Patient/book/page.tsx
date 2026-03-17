"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bookAppointment } from "@/lib/api";
import Card from "@/components/ui/Card";

// Format required by API: HH:MM-HH:MM
const TIME_SLOTS = [
  { label: "09:00 AM – 09:15 AM", value: "09:00-09:15" },
  { label: "09:15 AM – 09:30 AM", value: "09:15-09:30" },
  { label: "09:30 AM – 09:45 AM", value: "09:30-09:45" },
  { label: "09:45 AM – 10:00 AM", value: "09:45-10:00" },
  { label: "10:00 AM – 10:15 AM", value: "10:00-10:15" },
  { label: "10:15 AM – 10:30 AM", value: "10:15-10:30" },
  { label: "10:30 AM – 10:45 AM", value: "10:30-10:45" },
  { label: "10:45 AM – 11:00 AM", value: "10:45-11:00" },
  { label: "11:00 AM – 11:15 AM", value: "11:00-11:15" },
  { label: "11:15 AM – 11:30 AM", value: "11:15-11:30" },
  { label: "11:30 AM – 11:45 AM", value: "11:30-11:45" },
  { label: "11:45 AM – 12:00 PM", value: "11:45-12:00" },
  { label: "02:00 PM – 02:15 PM", value: "14:00-14:15" },
  { label: "02:15 PM – 02:30 PM", value: "14:15-14:30" },
  { label: "02:30 PM – 02:45 PM", value: "14:30-14:45" },
  { label: "02:45 PM – 03:00 PM", value: "14:45-15:00" },
  { label: "03:00 PM – 03:15 PM", value: "15:00-15:15" },
  { label: "03:15 PM – 03:30 PM", value: "15:15-15:30" },
  { label: "03:30 PM – 03:45 PM", value: "15:30-15:45" },
  { label: "03:45 PM – 04:00 PM", value: "15:45-16:00" },
  { label: "04:00 PM – 04:15 PM", value: "16:00-16:15" },
  { label: "04:15 PM – 04:30 PM", value: "16:15-16:30" },
];

export default function BookPage() {
  const router = useRouter();
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [booked, setBooked] = useState<{ token: number } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!appointmentDate || !timeSlot) return;
    setErr("");
    setLoading(true);
    try {
      const res = await bookAppointment(appointmentDate, timeSlot);
      setBooked({ token: res.queueToken || 0 });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Booking failed";
      if (msg.toLowerCase().includes("role")) {
        setErr("Your account is not a patient account. Only patients can book appointments.");
      } else if (msg.includes("401") || msg === "Unauthorized") {
        setErr("Session expired. Please log in again.");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setErr(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  if (booked) {
    return (
      <div style={{ maxWidth: 440 }}>
        <Card style={{ textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 48 }}>🎫</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 12 }}>Appointment Booked!</h2>
          <div style={{ margin: "16px 0", padding: "12px 20px", background: "var(--primary-light)", borderRadius: 10 }}>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>Your queue token</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: "var(--primary)" }}>#{booked.token}</div>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            Please arrive on time. The receptionist will call your token.
          </p>
          <button
            onClick={() => router.push("/Patient")}
            style={{ background: "var(--primary)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Back to My Appointments
          </button>
        </Card>
      </div>
    );
  }

  const canSubmit = Boolean(appointmentDate && timeSlot && !loading);

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Book Appointment</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>
          Choose a date and an available time slot.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", display: "block", marginBottom: 5 }}>
              Date
            </label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", fontSize: 14 }}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", display: "block", marginBottom: 6 }}>
              Time Slot
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              style={{
                width: "100%",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "9px 12px",
                fontSize: 14,
                background: "#fff",
                color: "var(--text)",
              }}
            >
              <option value="">— Pick a time slot —</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </div>

          {err && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: 8, padding: "9px 12px", fontSize: 13 }}>
              {err}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            style={{
              background: canSubmit ? "var(--primary)" : "#94a3b8",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "11px",
              fontSize: 14,
              fontWeight: 600,
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "background 0.15s",
            }}
          >
            {loading ? "Booking…" : "Confirm Booking"}
          </button>

        </form>
      </Card>
    </div>
  );
}
