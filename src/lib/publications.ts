/**
 * Shared publications store (localStorage-backed).
 *
 * Single source of truth for publications submitted via the three built-in
 * forms (Journal Paper, Conference Paper, Book / Book Chapter). The Admin,
 * HOD, Faculty and Student portals all read from here, so anything submitted
 * shows up everywhere immediately. When `VITE_API_BASE_URL` is wired up,
 * swap `localStorage` for HTTP calls — the shape stays the same.
 */

export type PublicationKind = "journal" | "conference" | "book";
export type PublicationStatus = "Pending" | "Approved" | "Rejected";

export type IndexingJournal = "SCI" | "SCIE" | "ESCI" | "Scopus" | "Web of Science";
export type IndexingConference = "Scopus" | "Web of Science";
export type JournalCategory = "Q1" | "Q2" | "Q3" | "Q4" | "Nil";
export type BookType = "Book" | "Book Chapter";

export type CollaborationType =
  | "Individual work"
  | "Collaboration work"
  | "Interdisciplinary within institute"
  | "Interdisciplinary with other institute"
  | "Collaboration with foreign authors"
  | "Publication with MITS student"
  | "Other";

export interface Author {
  name: string;
  affiliation: "MITS Scholar" | "Other" | string;
  affiliationDetail?: string;
}

interface BasePublication {
  id: string;
  kind: PublicationKind;
  facultyName: string;
  department: string;
  collaboration: CollaborationType;
  numberOfAuthors: number;
  correspondingAuthor: "Yes" | "No";
  mitsAuthorPosition: number; // 1..10
  authors: Author[];
  paperTitle: string;
  publicationHouse: string;
  doi: string;
  url?: string;
  citation: string; // MLA / APA
  status: PublicationStatus;
  rejectionReason?: string;
  submittedBy: string;        // email or display name of submitter
  submitterRole: "faculty" | "hod";
  submittedAt: string;        // ISO
}

export interface JournalPublication extends BasePublication {
  kind: "journal";
  indexing: IndexingJournal;
  category: JournalCategory;
  journalName: string;
  volume: string;
  issueNumber: string;
  pageNumber: string;
  publicationMonth: string;   // e.g. "March"
  year: number;
  issn: string;
  impactFactor: string;
}

export interface ConferencePublication extends BasePublication {
  kind: "conference";
  indexing: IndexingConference;
  conferenceName: string;
  volume: string;
  paperNumber: string;
  year: number;
}

export interface BookPublication extends BasePublication {
  kind: "book";
  publicationType: BookType;
  indexing: string;           // free text — varies for books
  publisherName: string;
  volume: string;
  pageNumber: string;
  year: number;
  isbn: string;
}

export type Publication =
  | JournalPublication
  | ConferencePublication
  | BookPublication;

const KEY = "fri-publications";
const EVT = "fri-publications-changed";

const sampleSeed: Publication[] = [
  {
    id: "p-seed-1",
    kind: "journal",
    facultyName: "Dr. Priya Sharma",
    department: "CSE",
    collaboration: "Collaboration work",
    numberOfAuthors: 3,
    correspondingAuthor: "Yes",
    mitsAuthorPosition: 1,
    authors: [
      { name: "Dr. Priya Sharma", affiliation: "MITS Scholar" },
      { name: "Dr. Anil Kumar", affiliation: "Other", affiliationDetail: "IIT Delhi" },
      { name: "Prof. R. Singh", affiliation: "Other", affiliationDetail: "NIT Trichy" },
    ],
    indexing: "SCI",
    category: "Q1",
    paperTitle: "AI for Academic Research Mapping",
    journalName: "IEEE Access",
    publicationHouse: "IEEE",
    volume: "12",
    issueNumber: "4",
    pageNumber: "1024-1038",
    publicationMonth: "March",
    year: 2024,
    issn: "2169-3536",
    doi: "10.1109/ACCESS.2024.0001",
    url: "https://ieeexplore.ieee.org/document/0001",
    impactFactor: "3.9",
    citation:
      "Sharma, P., Kumar, A., & Singh, R. (2024). AI for Academic Research Mapping. IEEE Access, 12(4), 1024–1038.",
    status: "Approved",
    submittedBy: "priya@mits.edu",
    submitterRole: "faculty",
    submittedAt: "2024-03-12T10:00:00Z",
  },
  {
    id: "p-seed-2",
    kind: "conference",
    facultyName: "Dr. R. Verma",
    department: "ECE",
    collaboration: "Individual work",
    numberOfAuthors: 1,
    correspondingAuthor: "Yes",
    mitsAuthorPosition: 1,
    authors: [{ name: "Dr. R. Verma", affiliation: "MITS Scholar" }],
    indexing: "Scopus",
    paperTitle: "Federated Learning at the Edge",
    conferenceName: "NeurIPS Workshop",
    publicationHouse: "NeurIPS",
    volume: "—",
    paperNumber: "FL-22",
    year: 2024,
    doi: "10.48550/arXiv.2402.00123",
    citation: "Verma, R. (2024). Federated Learning at the Edge. NeurIPS Workshop.",
    status: "Approved",
    submittedBy: "rverma@mits.edu",
    submitterRole: "hod",
    submittedAt: "2024-02-20T10:00:00Z",
  },
  {
    id: "p-seed-3",
    kind: "book",
    facultyName: "Dr. Anand Rao",
    department: "CSE",
    collaboration: "Individual work",
    numberOfAuthors: 1,
    correspondingAuthor: "Yes",
    mitsAuthorPosition: 1,
    authors: [{ name: "Dr. Anand Rao", affiliation: "MITS Scholar" }],
    publicationType: "Book",
    indexing: "Scopus",
    paperTitle: "Quantum Networks Primer",
    publisherName: "Springer",
    publicationHouse: "Springer",
    volume: "1",
    pageNumber: "320",
    year: 2022,
    isbn: "978-3-030-12345-6",
    doi: "10.1007/978-3-030-12345-6",
    citation: "Rao, A. (2022). Quantum Networks Primer. Springer.",
    status: "Approved",
    submittedBy: "anand@mits.edu",
    submitterRole: "faculty",
    submittedAt: "2022-09-01T10:00:00Z",
  },
];

const read = (): Publication[] => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(sampleSeed));
      return sampleSeed;
    }
    return JSON.parse(raw) as Publication[];
  } catch {
    return [];
  }
};

const write = (rows: Publication[]) => {
  localStorage.setItem(KEY, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent(EVT));
};

export const publicationsStore = {
  all: (): Publication[] => read(),
  byId: (id: string): Publication | undefined => read().find((p) => p.id === id),
  byUser: (email: string): Publication[] =>
    read().filter((p) => p.submittedBy.toLowerCase() === email.toLowerCase()),
  add: (pub: Publication) => {
    const rows = read();
    rows.unshift(pub);
    write(rows);
  },
  update: (id: string, patch: Partial<Publication>) => {
    const rows = read().map((p) => (p.id === id ? ({ ...p, ...patch } as Publication) : p));
    write(rows);
  },
  remove: (id: string) => write(read().filter((p) => p.id !== id)),
  setStatus: (id: string, status: PublicationStatus, reason?: string) => {
    const rows = read().map((p) =>
      p.id === id ? ({ ...p, status, rejectionReason: status === "Rejected" ? reason : undefined } as Publication) : p
    );
    write(rows);
  },
  /** Subscribe to changes — returns an unsubscribe fn. */
  subscribe: (cb: () => void) => {
    const handler = () => cb();
    window.addEventListener(EVT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVT, handler);
      window.removeEventListener("storage", handler);
    };
  },
};

/** React hook returning a live, sorted list of publications. */
import { useEffect, useState } from "react";
export const usePublications = (): Publication[] => {
  const [rows, setRows] = useState<Publication[]>(() => read());
  useEffect(() => publicationsStore.subscribe(() => setRows(read())), []);
  return rows;
};

export const newId = () =>
  `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const KIND_LABEL: Record<PublicationKind, string> = {
  journal: "Journal Paper",
  conference: "Conference Paper",
  book: "Book / Book Chapter",
};
