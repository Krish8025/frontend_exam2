"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/api";
import Card from "@/components/ui/Card";

const ROLES = ["doctor", "receptionist", "patient"] as const;

export default function CreateUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" });
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
      await createUser(form as Parameters<typeof createUser>[0]);
      setSuccess(true);
      setTimeout(() => router.push("/admin/users"), 1400);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>Create User</h1>
        <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 3 }}>
          Add a new doctor, receptionist, or patient to your clinic.
        </p>
      </div>

      <Card>
        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--primary)" }}>
            <div style={{ fontSize: 36 }}>✅</div>
            <p style={{ marginTop: 8, fontWeight: 600 }}>User created!</p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>Redirecting…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Name */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", display: "block", marginBottom: 5 }}>
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                placeholder="Dr. John Smith"
                style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", fontSize: 14 }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", display: "block", marginBottom: 5 }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                placeholder="user@clinic.com"
                style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", fontSize: 14 }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", display: "block", marginBottom: 5 }}>
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                placeholder="Set initial password"
                style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", fontSize: 14 }}
              />
            </div>

            {/* Role */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: "var(--muted)", display: "block", marginBottom: 5 }}>
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
                style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", fontSize: 14, background: "#fff" }}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r} style={{ textTransform: "capitalize" }}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {err && (
              <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: 8, padding: "9px 12px", fontSize: 13 }}>
                {err}
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  background: "var(--primary)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? "wait" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Creating…" : "Create User"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/users")}
                style={{
                  padding: "10px 18px",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  background: "#fff",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
