import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Eye, Download, Check, X, AlertCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  api,
  downloadResearchItem,
  rejectionStore,
  type SubmissionStatus,
  type ResearchItem,
} from "@/lib/api";
import {
  ViewDetailsDialog,
  RejectReasonDialog,
  type SubmissionDetails,
} from "@/components/SubmissionDialogs";

interface Submission {
  id: number;
  faculty: string;
  authorRole: "hod" | "faculty";
  form: string;
  type: ResearchItem["type"];
  dept: string;
  date: string;
  status: SubmissionStatus;
  fileName?: string;
  fileSize?: string;
  abstract?: string;
}

const initial: Submission[] = [
  { id: 1, faculty: "Dr. Priya Sharma", authorRole: "faculty", form: "Research Paper 2024", type: "paper", dept: "CSE", date: "2024-03-15", status: "Pending", fileName: "ai_research_mapping.pdf", fileSize: "2.4 MB", abstract: "Mapping AI techniques to academic research workflows." },
  { id: 2, faculty: "Dr. Amit Kumar", authorRole: "faculty", form: "Conference Attendance", type: "conference", dept: "ECE", date: "2024-03-14", status: "Approved", fileName: "ieee_pes_2024.pdf", fileSize: "1.1 MB" },
  { id: 3, faculty: "Dr. Neha Singh", authorRole: "faculty", form: "Book Publication", type: "book", dept: "ME", date: "2024-03-14", status: "Pending", fileName: "sustainable_materials.pdf", fileSize: "3.8 MB", abstract: "Comprehensive review of sustainable engineering materials." },
  { id: 4, faculty: "Dr. Raj Patel", authorRole: "faculty", form: "Research Paper 2024", type: "paper", dept: "IT", date: "2024-03-13", status: "Approved", fileName: "iot_campus.pdf", fileSize: "1.9 MB" },
  { id: 5, faculty: "Dr. Meera Joshi", authorRole: "faculty", form: "Patent Filing", type: "paper", dept: "CE", date: "2024-03-12", status: "Rejected", fileName: "patent_filing.pdf", fileSize: "0.9 MB" },
  { id: 6, faculty: "Dr. R. Verma (HOD)", authorRole: "hod", form: "Book Chapter — Edge AI", type: "chapter", dept: "ECE", date: "2024-03-11", status: "Pending", fileName: "edge_ai_chapter.pdf", fileSize: "1.4 MB", abstract: "Chapter on edge AI architectures for IoT." },
  { id: 7, faculty: "Dr. S. Mehta (HOD)", authorRole: "hod", form: "Conference Paper — Federated Learning", type: "conference", dept: "CSE", date: "2024-03-10", status: "Pending", fileName: "federated_learning.pdf", fileSize: "2.0 MB", abstract: "Federated learning at the edge — NeurIPS workshop." },
];

const TYPE_OPTIONS: { value: ResearchItem["type"] | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "paper", label: "Research Paper" },
  { value: "book", label: "Book" },
  { value: "chapter", label: "Book Chapter" },
  { value: "conference", label: "Conference" },
];

const STATUS_OPTIONS: { value: SubmissionStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

const Submissions = () => {
  const [rows, setRows] = useState<Submission[]>(initial);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResearchItem["type"] | "all">("all");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Modal state
  const [viewItem, setViewItem] = useState<SubmissionDetails | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectTargets, setRejectTargets] = useState<Submission[]>([]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return rows.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.faculty, r.form, r.dept, r.status, r.authorRole, r.date]
        .some((v) => v.toLowerCase().includes(q));
    });
  }, [rows, query, typeFilter, statusFilter]);

  const pendingFilteredIds = useMemo(
    () => filtered.filter((r) => r.status === "Pending").map((r) => r.id),
    [filtered]
  );
  const allPendingSelected =
    pendingFilteredIds.length > 0 && pendingFilteredIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0;

  const toggleOne = (id: number, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleAllPending = (checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      pendingFilteredIds.forEach((id) => (checked ? next.add(id) : next.delete(id)));
      return next;
    });
  };

  const setStatus = (id: number, status: SubmissionStatus) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  const handleApprove = async (s: Submission) => {
    setStatus(s.id, "Approved");
    rejectionStore.clear(s.id);
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(s.id);
      return n;
    });
    const res = await api.approveSubmission(s.id);
    if (res.ok) toast.success(`Approved: ${s.form} — ${s.faculty}`);
    else toast.error("Failed to approve");
  };

  const performReject = async (subs: Submission[], reason: string) => {
    subs.forEach((s) => {
      setStatus(s.id, "Rejected");
      rejectionStore.set({
        id: String(s.id),
        reason,
        rejectedBy: "admin",
        rejectedAt: new Date().toISOString(),
        title: s.form,
        faculty: s.faculty,
      });
    });
    setSelected(new Set());
    await Promise.all(subs.map((s) => api.rejectSubmission(s.id, reason)));
    toast.success(
      subs.length === 1 ? `Rejected: ${subs[0].form}` : `Rejected ${subs.length} submissions`
    );
  };

  const openReject = (subs: Submission[]) => {
    setRejectTargets(subs);
    setRejectOpen(true);
  };

  const handleBulkApprove = async () => {
    const targets = rows.filter((r) => selected.has(r.id) && r.status === "Pending");
    if (!targets.length) {
      toast.error("No pending submissions selected");
      return;
    }
    targets.forEach((t) => {
      setStatus(t.id, "Approved");
      rejectionStore.clear(t.id);
    });
    setSelected(new Set());
    await Promise.all(targets.map((t) => api.approveSubmission(t.id)));
    toast.success(`Approved ${targets.length} submission${targets.length > 1 ? "s" : ""}`);
  };

  const handleBulkReject = () => {
    const targets = rows.filter((r) => selected.has(r.id) && r.status === "Pending");
    if (!targets.length) {
      toast.error("No pending submissions selected");
      return;
    }
    openReject(targets);
  };

  const toDetails = (s: Submission): SubmissionDetails => ({
    id: s.id,
    faculty: s.faculty,
    authorRole: s.authorRole,
    form: s.form,
    type: s.type,
    dept: s.dept,
    date: s.date,
    status: s.status,
    fileName: s.fileName,
    fileSize: s.fileSize,
    abstract: s.abstract,
  });

  const handleDownload = (s: Submission) => {
    downloadResearchItem({
      id: String(s.id),
      title: s.form,
      type: s.type,
      author: s.faculty,
      authorRole: s.authorRole,
      department: s.dept,
      venue: "—",
      year: new Date(s.date).getFullYear(),
      status: s.status,
    });
    toast.success("Download started");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">
          Submission Reports
        </h1>
        <p className="text-muted-foreground mt-1">
          Approve, reject and download all submissions from HODs and Faculty.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-serif">All Submissions</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search faculty, form, dept…"
                  className="pl-8 w-56"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPE_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {someSelected && (
            <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/40 px-3 py-2">
              <p className="text-sm">
                <span className="font-medium">{selected.size}</span> selected
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelected(new Set())}>
                  Clear
                </Button>
                <Button size="sm" variant="destructive" className="gap-1" onClick={handleBulkReject}>
                  <X className="h-3 w-3" /> Reject Selected
                </Button>
                <Button size="sm" className="gap-1" onClick={handleBulkApprove}>
                  <Check className="h-3 w-3" /> Approve Selected
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allPendingSelected}
                    onCheckedChange={(c) => toggleAllPending(Boolean(c))}
                    aria-label="Select all pending"
                    disabled={pendingFilteredIds.length === 0}
                  />
                </TableHead>
                <TableHead>Faculty / HOD</TableHead>
                <TableHead className="hidden sm:table-cell">Form</TableHead>
                <TableHead className="hidden md:table-cell">Dept</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => {
                const rejection = rejectionStore.get(s.id);
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <Checkbox
                        checked={selected.has(s.id)}
                        onCheckedChange={(c) => toggleOne(s.id, Boolean(c))}
                        disabled={s.status !== "Pending"}
                        aria-label={`Select ${s.form}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {s.faculty}
                      {s.authorRole === "hod" && (
                        <Badge variant="outline" className="ml-2 text-[10px]">
                          HOD
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{s.form}</TableCell>
                    <TableCell className="hidden md:table-cell">{s.dept}</TableCell>
                    <TableCell className="hidden lg:table-cell">{s.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant={
                            s.status === "Approved"
                              ? "default"
                              : s.status === "Rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {s.status}
                        </Badge>
                        {s.status === "Rejected" && rejection && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertCircle className="h-3.5 w-3.5 text-destructive cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="text-xs font-medium mb-1">Rejection reason</p>
                                <p className="text-xs">{rejection.reason}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View Details"
                          onClick={() => {
                            setViewItem(toDetails(s));
                            setViewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Download"
                          onClick={() => handleDownload(s)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {s.status === "Pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Approve"
                              onClick={() => handleApprove(s)}
                            >
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Reject"
                              onClick={() => openReject([s])}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No submissions match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ViewDetailsDialog
        submission={viewItem}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onDownload={(s) => handleDownload(rows.find((r) => r.id === s.id)!)}
        onApprove={(s) => handleApprove(rows.find((r) => r.id === s.id)!)}
        onReject={(s) => openReject([rows.find((r) => r.id === s.id)!])}
      />

      <RejectReasonDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        subjectLabel={
          rejectTargets.length === 1
            ? rejectTargets[0].form
            : `${rejectTargets.length} submissions`
        }
        onConfirm={(reason) => performReject(rejectTargets, reason)}
      />
    </div>
  );
};

export default Submissions;
