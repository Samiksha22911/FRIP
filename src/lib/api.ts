export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export type Role = "admin" | "hod" | "faculty";
export type ResearchItemType = "paper" | "book" | "chapter" | "conference";
export type SubmissionStatus = "Pending" | "Approved" | "Rejected";

export interface PortalStats {
  facultyMembers: number;
  researchPapers: number;
  departments: number;
  digitalTracking: number;
}

export interface DashboardStats {
  totalFaculty?: number;
  formsCreated?: number;
  pendingSubmissions?: number;
  submittedForms?: number;
  approvedReports?: number;
  publications?: number;
  averageScore?: number;
  departmentRank?: number;
}

export interface PublishedPaper {
  id: string;
  title: string;
  faculty: string;
  department: string;
  journal: string;
  year: number;
  status: "Published" | "Approved" | "Pending";
  score?: number;
}

export interface ResearchItem {
  id: string;
  title: string;
  type: ResearchItemType;
  author: string;
  authorRole: "hod" | "faculty";
  department: string;
  venue: string;
  year: number;
  status: SubmissionStatus;
  fileUrl?: string;
}

export interface ActivityEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
}

const authHeaders = (): HeadersInit | undefined => {
  const token = localStorage.getItem("fri-token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

const getJson = async <T>(path: string, fallback: T): Promise<T> => {
  if (!API_BASE_URL) return fallback;
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, { headers: authHeaders() });
    if (!response.ok) throw new Error(`API error ${response.status}`);
    return response.json();
  } catch (error) {
    console.warn(`Using fallback data for ${path}`, error);
    return fallback;
  }
};

const postJson = async <T>(path: string, body: unknown, fallback: T): Promise<T> => {
  if (!API_BASE_URL) return fallback;
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { ...(authHeaders() || {}), "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`API error ${response.status}`);
    return response.json();
  } catch (error) {
    console.warn(`Using fallback for ${path}`, error);
    return fallback;
  }
};

export const formatCompact = (value: number) => {
  if (value >= 1000) return `${Math.round(value / 1000)}K+`;
  return `${value}+`;
};

export const downloadReportPdf = (path: string) => {
  if (!API_BASE_URL) return;
  const token = localStorage.getItem("fri-token");
  const url = new URL(`${API_BASE_URL}${path}`);
  if (token) url.searchParams.set("token", token);
  window.open(url.toString(), "_blank", "noopener,noreferrer");
};

/** Download any research item (paper, book, chapter, conference). Falls back to a generated text file when no backend is configured. */
export const downloadResearchItem = (item: ResearchItem) => {
  if (API_BASE_URL) {
    downloadReportPdf(`/research/${item.id}/download`);
    return;
  }
  if (item.fileUrl) {
    window.open(item.fileUrl, "_blank", "noopener,noreferrer");
    return;
  }
  const content = [
    `FRI Portal — Research Item`,
    `========================`,
    `Title: ${item.title}`,
    `Type: ${item.type}`,
    `Author: ${item.author} (${item.authorRole.toUpperCase()})`,
    `Department: ${item.department}`,
    `Venue: ${item.venue}`,
    `Year: ${item.year}`,
    `Status: ${item.status}`,
    ``,
    `(This is a placeholder file. Connect VITE_API_BASE_URL to download the original document.)`,
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${item.title.replace(/[^a-z0-9]+/gi, "_")}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

const sampleResearchItems: ResearchItem[] = [
  { id: "r1", title: "AI for Academic Research Mapping", type: "paper", author: "Dr. Priya Sharma", authorRole: "faculty", department: "CSE", venue: "IEEE Access", year: 2024, status: "Approved" },
  { id: "r2", title: "IoT Based Campus Monitoring", type: "paper", author: "Dr. Amit Kumar", authorRole: "faculty", department: "ECE", venue: "Springer IoT Journal", year: 2023, status: "Approved" },
  { id: "r3", title: "Modern Embedded Systems", type: "book", author: "Dr. R. Verma", authorRole: "hod", department: "ECE", venue: "Pearson", year: 2023, status: "Approved" },
  { id: "r4", title: "Chapter: Edge AI Architectures", type: "chapter", author: "Dr. R. Verma", authorRole: "hod", department: "ECE", venue: "Wiley Handbook of AI", year: 2024, status: "Approved" },
  { id: "r5", title: "Sustainable Materials Review", type: "paper", author: "Dr. Neha Singh", authorRole: "faculty", department: "ME", venue: "Elsevier Materials Today", year: 2023, status: "Pending" },
  { id: "r6", title: "Federated Learning at the Edge", type: "conference", author: "Dr. S. Mehta", authorRole: "hod", department: "CSE", venue: "NeurIPS Workshop", year: 2024, status: "Approved" },
  { id: "r7", title: "Quantum Networks Primer", type: "book", author: "Dr. Anand Rao", authorRole: "faculty", department: "CSE", venue: "Springer", year: 2022, status: "Approved" },
  { id: "r8", title: "Smart Grid Reliability", type: "conference", author: "Dr. K. Iyer", authorRole: "faculty", department: "EE", venue: "IEEE PES", year: 2024, status: "Pending" },
];

const sampleActivity: ActivityEntry[] = [
  { id: "a1", actor: "Dr. Priya Sharma", action: "submitted", target: "Research Paper 2024", at: "2 hours ago" },
  { id: "a2", actor: "HOD ECE", action: "approved", target: "Conference Attendance — Dr. Amit", at: "5 hours ago" },
  { id: "a3", actor: "Admin", action: "created form", target: "Patent Filing 2024", at: "Yesterday" },
  { id: "a4", actor: "Dr. R. Verma", action: "uploaded", target: "Book chapter — Edge AI", at: "Yesterday" },
  { id: "a5", actor: "HOD CSE", action: "rejected", target: "Patent Filing — Dr. Meera", at: "2 days ago" },
];

export const api = {
  portalStats: () =>
    getJson<PortalStats>("/stats/portal", {
      facultyMembers: 500,
      researchPapers: 10000,
      departments: 50,
      digitalTracking: 100,
    }),
  dashboardStats: (role: Role) =>
    getJson<DashboardStats>(`/dashboard/${role}/stats`, {
      totalFaculty: role === "hod" ? 32 : 248,
      formsCreated: 18,
      pendingSubmissions: role === "faculty" ? 3 : role === "hod" ? 8 : 64,
      submittedForms: 11,
      approvedReports: role === "faculty" ? 8 : role === "hod" ? 187 : 1247,
      publications: 14,
      averageScore: 85,
      departmentRank: 12,
    }),
  publishedPapers: (role: Role) =>
    getJson<PublishedPaper[]>(`/reports/${role}/published-papers`, [
      { id: "1", title: "AI for Academic Research Mapping", faculty: "Dr. Priya Sharma", department: "CSE", journal: "IEEE Access", year: 2024, status: "Published", score: 92 },
      { id: "2", title: "IoT Based Campus Monitoring", faculty: "Dr. Amit Kumar", department: "ECE", journal: "Springer IoT Journal", year: 2023, status: "Published", score: 88 },
      { id: "3", title: "Sustainable Materials Review", faculty: "Dr. Neha Singh", department: "ME", journal: "Elsevier Materials Today", year: 2023, status: "Approved", score: 84 },
    ]),
  researchItems: (scope: "all" | "hod" | "mine" = "all") =>
    getJson<ResearchItem[]>(`/research?scope=${scope}`,
      scope === "hod" ? sampleResearchItems.filter((i) => i.authorRole === "hod") : sampleResearchItems),
  approveSubmission: (id: string | number) =>
    postJson<{ ok: boolean }>(`/submissions/${id}/approve`, {}, { ok: true }),
  rejectSubmission: (id: string | number, reason?: string) =>
    postJson<{ ok: boolean }>(`/submissions/${id}/reject`, { reason }, { ok: true }),
  activity: (role: Role) => getJson<ActivityEntry[]>(`/activity/${role}`, sampleActivity),
};

/* ---------------- Rejection reason store (localStorage-backed) ----------------
 * Lets Admin / HOD persist a reason for a rejected submission and lets the
 * Faculty/HOD owner see it in their MyReports / MyResearch / MyForms pages so
 * they can edit and resubmit. When VITE_API_BASE_URL is set, the store is
 * still updated locally for an instant UI response while the backend call
 * (`api.rejectSubmission`) carries the reason to the server.
 */

const REJECTIONS_KEY = "fri-rejections";

export interface RejectionRecord {
  id: string;            // submission id (stringified)
  reason: string;
  rejectedBy: Role;      // who rejected it
  rejectedAt: string;    // ISO date
  title?: string;
  faculty?: string;
}

const readRejections = (): Record<string, RejectionRecord> => {
  try {
    return JSON.parse(localStorage.getItem(REJECTIONS_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeRejections = (data: Record<string, RejectionRecord>) => {
  localStorage.setItem(REJECTIONS_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("fri-rejections-changed"));
};

export const rejectionStore = {
  get: (id: string | number): RejectionRecord | undefined => readRejections()[String(id)],
  all: (): RejectionRecord[] => Object.values(readRejections()),
  set: (record: RejectionRecord) => {
    const data = readRejections();
    data[record.id] = record;
    writeRejections(data);
  },
  clear: (id: string | number) => {
    const data = readRejections();
    delete data[String(id)];
    writeRejections(data);
  },
};
