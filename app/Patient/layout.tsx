"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import { getSession, StoredUser } from "@/lib/auth";

const PATIENT_NAV = [
  { label: "My Appointments", href: "/Patient", icon: "📋" },
  { label: "Book Appointment", href: "/Patient/book", icon: "📅" },
  { label: "Prescriptions", href: "/Patient/prescriptions", icon: "💊" },
  { label: "Reports", href: "/Patient/reports", icon: "📄" },
];

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "patient") {
      router.replace("/");
    } else {
      setUser(s);
    }
  }, [router]);

  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar user={user} items={PATIENT_NAV} />
      <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}
