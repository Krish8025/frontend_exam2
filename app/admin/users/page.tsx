"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listUsers, AdminUser } from "@/lib/api";
import Card from "@/components/ui/Card";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    listUsers()
      .then(setUsers)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ color: "var(--muted)", paddingTop: 60, textAlign: "center" }}>Loading users…</div>;
  if (err) return <div style={{ color: "var(--danger)", paddingTop: 20 }}>{err}</div>;

  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>Users</h1>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 2 }}>{users.length} total</p>
        </div>
        <Link
          href="/admin/users/create"
          style={{
            background: "var(--primary)",
            color: "#fff",
            borderRadius: 8,
            padding: "9px 18px",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          + Create User
        </Link>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg)" }}>
              {["#", "Name", "Email", "Role"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 16px",
                    textAlign: "left",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={u.id}
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <td style={{ padding: "10px 16px", fontSize: 13, color: "var(--muted)" }}>{i + 1}</td>
                <td style={{ padding: "10px 16px", fontSize: 14, fontWeight: 500 }}>{u.name}</td>
                <td style={{ padding: "10px 16px", fontSize: 13, color: "var(--muted)" }}>{u.email}</td>
                <td style={{ padding: "10px 16px" }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: "3px 10px",
                      borderRadius: 20,
                      textTransform: "capitalize",
                      background:
                        u.role === "doctor" ? "#fff7ed" :
                        u.role === "patient" ? "#eff6ff" :
                        u.role === "receptionist" ? "#fdf4ff" : "#f0fdf4",
                      color:
                        u.role === "doctor" ? "#c2410c" :
                        u.role === "patient" ? "#1d4ed8" :
                        u.role === "receptionist" ? "#7e22ce" : "#15803d",
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
  );
}
