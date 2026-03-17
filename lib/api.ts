const BASE = "https://cmsback.sampaarsh.cloud";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("cms_token");
}

type FetchOptions = RequestInit & { skipAuth?: boolean };

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipAuth, ...rest } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(rest.headers as Record<string, string> || {}),
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, { ...rest, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

// Auth
export type UserRole = "admin" | "patient" | "receptionist" | "doctor";

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    clinicId: string;
    clinicName: string;
    clinicCode: string;
  };
}

export function login(email: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
}

// Admin
export interface ClinicInfo {
  id: string;
  name: string;
  code: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export function getClinic() {
  return apiFetch<ClinicInfo>("/admin/clinic");
}

export function listUsers() {
  return apiFetch<AdminUser[]>("/admin/users");
}

export function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}) {
  return apiFetch("/admin/users", { method: "POST", body: JSON.stringify(data) });
}

// Appointments
export interface Appointment {
  id: string;
  date: string;
  timeSlot: string;
  status: string;
  queueToken?: number;
  queueStatus?: string;
}

export function bookAppointment(appointmentDate: string, timeSlot: string) {
  return apiFetch<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify({ appointmentDate, timeSlot }),
  });
}

export function myAppointments() {
  return apiFetch<Appointment[]>("/appointments/my");
}

export function appointmentDetails(id: string) {
  return apiFetch<Appointment>(`/appointments/${id}`);
}

// Queue
export interface QueueEntry {
  id: string;
  token: number;
  status: "waiting" | "in-progress" | "done" | "skipped";
  patientName: string;
  appointmentId: string;
  timeSlot: string;
}

export function getDailyQueue(date: string) {
  return apiFetch<QueueEntry[]>(`/queue?date=${date}`);
}

export function updateQueueStatus(
  id: string,
  status: "in-progress" | "done" | "skipped"
) {
  return apiFetch(`/queue/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// Doctor
export interface DoctorQueueItem {
  token: number;
  patientName: string;
  appointmentId: string | number;
  status: string;
}

export function getDoctorQueue() {
  return apiFetch<DoctorQueueItem[]>("/doctor/queue");
}

// Prescriptions
export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  duration: string;
}

export interface Prescription {
  id: string;
  medicines: PrescriptionMedicine[];
  notes: string;
  date: string;
  doctorName?: string;
}

export function myPrescriptions() {
  return apiFetch<Prescription[]>("/prescriptions/my");
}

export function addPrescription(
  appointmentId: string,
  medicines: PrescriptionMedicine[],
  notes: string
) {
  return apiFetch(`/prescriptions/${appointmentId}`, {
    method: "POST",
    body: JSON.stringify({ medicines, notes }),
  });
}

// Reports
export interface Report {
  id: string;
  diagnosis: string;
  tests: string;
  remarks: string;
  date: string;
  doctorName?: string;
}

export function myReports() {
  return apiFetch<Report[]>("/reports/my");
}

export function addReport(
  appointmentId: string,
  diagnosis: string,
  tests: string,
  remarks: string
) {
  return apiFetch(`/reports/${appointmentId}`, {
    method: "POST",
    body: JSON.stringify({ diagnosis, tests, remarks }),
  });
}
