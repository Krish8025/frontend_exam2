"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getClinic, listUsers, ClinicInfo, AdminUser } from "@/lib/api";
import { getSession } from "@/lib/auth";
import Card from "@/components/ui/Card";

function CountCard({ label, count, icon, color }: { label: string; count: number; icon: string; color: string }) {
  return (
    <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 700 }}>{count}</div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>{label}</div>
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const user = getSession();
  const [clinic, setClinic] = useState<ClinicInfo | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getClinic(), listUsers()])
      .then(([c, u]) => {
        setClinic(c);
        setUsers(u);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: 80, color: "var(--muted)" }}>
        Loading dashboard…
      </div>
    );
  }

  const doctors = users.filter((u) => u.role === "doctor").length;
  const receptionists = users.filter((u) => u.role === "receptionist").length;
  const patients = users.filter((u) => u.role === "patient").length;

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>
          Welcome back, {user?.name} 👋
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>
          {clinic?.name} &nbsp;·&nbsp; Code: <b>{clinic?.code}</b>
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
        <CountCard label="Doctors" count={doctors} icon="👨‍⚕️" color="#f0fdf4" />
        <CountCard label="Receptionists" count={receptionists} icon="🧑‍💼" color="#eff6ff" />
        <CountCard label="Patients" count={patients} icon="🧑‍🤝‍🧑" color="#fdf4ff" />
      </div>

      {/* Quick actions */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Quick Actions</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <Link
            href="/admin/users"
            style={{
              padding: "10px 20px",
              background: "var(--primary)",
              color: "#fff",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            View All Users
          </Link>
          <Link
            href="/admin/users/create"
            style={{
              padding: "10px 20px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            + Create User
          </Link>
        </div>
      </div>

      {/* Recent users mini-table */}
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Recent Users</h2>
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                {["Name", "Email", "Role"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((u, i) => (
                <tr
                  key={u.id}
                  style={{
                    borderTop: i > 0 ? "1px solid var(--border)" : undefined,
                  }}
                >
                  <td style={{ padding: "10px 16px", fontSize: 14, fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "var(--muted)" }}>{u.email}</td>
                  <td style={{ padding: "10px 16px" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "2px 10px",
                        borderRadius: 20,
                        background: u.role === "doctor" ? "#fff7ed" : u.role === "patient" ? "#eff6ff" : u.role === "receptionist" ? "#fdf4ff" : "#f0fdf4",
                        color: u.role === "doctor" ? "#c2410c" : u.role === "patient" ? "#1d4ed8" : u.role === "receptionist" ? "#7e22ce" : "#15803d",
                        textTransform: "capitalize",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
