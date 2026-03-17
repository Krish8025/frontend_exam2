"use client";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "patient" | "receptionist" | "doctor";
  clinicId: string;
  clinicName: string;
  clinicCode: string;
}

export function saveSession(token: string, user: StoredUser) {
  localStorage.setItem("cms_token", token);
  localStorage.setItem("cms_user", JSON.stringify(user));
}

export function getSession(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("cms_user");
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  localStorage.removeItem("cms_token");
  localStorage.removeItem("cms_user");
}

export function roleHomePath(role: string): string {
  switch (role) {
    case "admin": return "/admin";
    case "patient": return "/Patient";
    case "receptionist": return "/Receptionist";
    case "doctor": return "/doctor";
    default: return "/";
  }
}
