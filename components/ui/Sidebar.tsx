"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession, StoredUser } from "@/lib/auth";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface Props {
  user: StoredUser;
  items: NavItem[];
}

export default function Sidebar({ user, items }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.push("/");
  }

  return (
    <aside
      style={{
        width: 232,
        minHeight: "100vh",
        background: "#fff",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "0",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 18,
            }}
          >
            🏥
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>
              ClinicMS
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>
              {user.clinicName}
            </div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--border)",
          marginBottom: 6,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
        <div
          style={{
            fontSize: 11,
            color: "var(--muted)",
            marginTop: 2,
            textTransform: "capitalize",
          }}
        >
          {user.role} · {user.clinicCode}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: active ? "var(--primary)" : "var(--text)",
                background: active ? "var(--primary-light)" : "transparent",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)" }}>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "var(--danger)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px 0",
            width: "100%",
          }}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
