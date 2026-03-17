"use client";

import { useEffect, useState, useCallback } from "react";
import { getDailyQueue, updateQueueStatus, QueueEntry } from "@/lib/api";

type StatusAction = "in-progress" | "done" | "skipped";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  waiting:     { bg: "#fef9c3", color: "#92400e" },
  "in-progress": { bg: "#dbeafe", color: "#1d4ed8" },
  done:        { bg: "#dcfce7", color: "#166534" },
  skipped:     { bg: "#fee2e2", color: "#991b1b" },
};

function today() {
  return new Date().toISOString().split("T")[0];
}

export default function QueuePage() {
  const [date, setDate] = useState(today());
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);
  const [err, setErr] = useState("");

  const fetchQueue = useCallback(async (d: string) => {
    setLoading(true);
    setErr("");
    try {
      const data = await getDailyQueue(d);
      setQueue(data);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to load queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue(date);
  }, [date, fetchQueue]);

  async function handleAction(id: string, status: StatusAction) {
    setUpdating(id);
    try {
      await updateQueueStatus(id, status);
      await fetchQueue(date);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setUpdating(null);
    }
  }

  const waiting = queue.filter((q) => q.status === "waiting").length;
  const done = queue.filter((q) => q.status === "done").length;
  const inProgress = queue.find((q) => q.status === "in-progress");

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Daily Queue</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 3 }}>
          Manage patient queue for a selected date
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 14 }}
        />
        <button
          onClick={() => fetchQueue(date)}
          style={{ background: "var(--primary)", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontSize: 14, cursor: "pointer" }}
        >
          Refresh
        </button>
      </div>

      {/* Summary row */}
      {!loading && queue.length > 0 && (
        <div style={{ display: "flex", gap: 12, marginBottom: 22 }}>
          {[
            { label: "Total", value: queue.length, bg: "#f1f5f9", color: "#475569" },
            { label: "Waiting", value: waiting, bg: "#fef9c3", color: "#92400e" },
            { label: "Done", value: done, bg: "#dcfce7", color: "#166534" },
          ].map((s) => (
            <div
              key={s.label}
              style={{ padding: "10px 20px", borderRadius: 10, background: s.bg, color: s.color, fontWeight: 600, fontSize: 14 }}
            >
              {s.value} {s.label}
            </div>
          ))}
          {inProgress && (
            <div style={{ padding: "10px 20px", borderRadius: 10, background: "#dbeafe", color: "#1d4ed8", fontWeight: 600, fontSize: 14 }}>
              Now: {inProgress.patientName} (Token #{inProgress.token})
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {err && (
        <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>
          {err}
        </div>
      )}

      {/* Queue list */}
      {loading ? (
        <div style={{ textAlign: "center", paddingTop: 60, color: "var(--muted)" }}>Loading queue…</div>
      ) : queue.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "32px", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>
          No queue entries for this date.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {queue.map((entry) => {
            const sc = STATUS_COLORS[entry.status] || { bg: "#f1f5f9", color: "#475569" };
            return (
              <div
                key={entry.id}
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
                {/* Left: token + patient */}
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {entry.token}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{entry.patientName}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Slot: {entry.timeSlot}</div>
                  </div>
                </div>

                {/* Right: badge + actions */}
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
                    {entry.status.replace("_", " ")}
                  </span>

                  {entry.status === "waiting" && (
                    <>
                      <button
                        onClick={() => handleAction(entry.id, "in-progress")}
                        disabled={updating === entry.id}
                        style={{ background: "#dbeafe", color: "#1d4ed8", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                      >
                        Call
                      </button>
                      <button
                        onClick={() => handleAction(entry.id, "skipped")}
                        disabled={updating === entry.id}
                        style={{ background: "#fee2e2", color: "#991b1b", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                      >
                        Skip
                      </button>
                    </>
                  )}

                  {entry.status === "in-progress" && (
                    <button
                      onClick={() => handleAction(entry.id, "done")}
                      disabled={updating === entry.id}
                      style={{ background: "#dcfce7", color: "#166534", border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                    >
                      {updating === entry.id ? "…" : "Done"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
