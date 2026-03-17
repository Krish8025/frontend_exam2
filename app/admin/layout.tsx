"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import { getSession, StoredUser } from "@/lib/auth";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: "🏠" },
  { label: "All Users", href: "/admin/users", icon: "👥" },
  { label: "Create User", href: "/admin/users/create", icon: "➕" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "admin") {
      router.replace("/");
    } else {
      setUser(s);
    }
  }, [router]);

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar user={user} items={ADMIN_NAV} />
      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
