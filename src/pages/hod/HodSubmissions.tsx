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
import { Eye, Download, Check, X, Search, AlertCircle } from "lucide-react";
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

interface HodSub {
  id: number;
  faculty: string;
  form: string;
  type: ResearchItem["type"];
  date: string;
  status: SubmissionStatus;
  fileName?: string;
  fileSize?: string;
  abstract?: string;
}

const initial: HodSub[] = [
  { id: 101, faculty: "Dr. Priya Sharma", form: "Research Paper 2024", type: "paper", date: "2024-03-15", status: "Approved", fileName: "research_paper.pdf", fileSize: "2.1 MB" },
  { id: 102, faculty: "Dr. Amit Kumar", form: "Conference Attendance", type: "conference", date: "2024-03-14", status: "Approved", fileName: "conference.pdf", fileSize: "1.0 MB" },
  { id: 103, faculty: "Dr. Neha Singh", form: "Book Publication", type: "book", date: "2024-03-14", status: "Pending", fileName: "book_publication.pdf", fileSize: "3.6 MB", abstract: "Sustainable engineering materials handbook." },
  { id: 104, faculty: "Dr. Raj Patel", form: "Research Paper 2024", type: "paper", date: "2024-03-13", status: "Pending", fileName: "raj_paper.pdf", fileSize: "1.7 MB", abstract: "IoT-based campus monitoring." },
  { id: 105, faculty: "Dr. Meera Joshi", form: "Book Chapter — IoT", type: "chapter", date: "2024-03-12", status: "Pending", fileName: "iot_chapter.pdf", fileSize: "1.3 MB", abstract: "Chapter on IoT in smart cities." },
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

const HodSubmissions = () => {
  const [rows, setRows] = useState<HodSub[]>(initial);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ResearchItem["type"] | "all">("all");
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | "all">("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const [viewItem, setViewItem] = useState<SubmissionDetails | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectTargets, setRejectTargets] = useState<HodSub[]>([]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return rows.filter((r) => {
      if (typeFilter !== "all" && r.type !== typeFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.faculty, r.form, r.status, r.date].some((v) => v.toLowerCase().includes(q));
    });
  }, [rows, query, typeFilter, statusFilter]);

  const pendingFilteredIds = useMemo(
    () => filtered.filter((r) => r.status === "Pending").map((r) => r.id),
    [filtered]
  );
  const allPendingSelected =
    pendingFilteredIds.length > 0 && pendingFilteredIds.every((id) => selected.has(id));

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

  const onApprove = async (s: HodSub) => {
    setStatus(s.id, "Approved");
    rejectionStore.clear(s.id);
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(s.id);
      return n;
    });
    await api.approveSubmission(s.id);
    toast.success(`Approved: ${s.form}`);
  };

  const performReject = async (subs: HodSub[], reason: string) => {
    subs.forEach((s) => {
      setStatus(s.id, "Rejected");
      rejectionStore.set({
        id: String(s.id),
        reason,
        rejectedBy: "hod",
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

  const openReject = (subs: HodSub[]) => {
    setRejectTargets(subs);
    setRejectOpen(true);
  };

  const handleBulkApprove = async () => {
    const targets = rows.filter((r) => selected.has(r.id) && r.status === "Pending");
    if (!targets.length) return toast.error("No pending submissions selected");
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
    if (!targets.length) return toast.error("No pending submissions selected");
    openReject(targets);
  };

  const onDownload = (s: HodSub) => {
    downloadResearchItem({
      id: String(s.id),
      title: s.form,
      type: s.type,
      author: s.faculty,
      authorRole: "faculty",
      department: "Department",
      venue: "—",
      year: new Date(s.date).getFullYear(),
      status: s.status,
    });
  };

  const toDetails = (s: HodSub): SubmissionDetails => ({
    id: s.id,
    faculty: s.faculty,
    authorRole: "faculty",
    form: s.form,
    type: s.type,
    date: s.date,
    status: s.status,
    fileName: s.fileName,
    fileSize: s.fileSize,
    abstract: s.abstract,
  });

  const someSelected = selected.size > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Submissions</h1>
        <p className="text-muted-foreground mt-1">
          Approve, reject and download submissions from your department.
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
                  placeholder="Search faculty or form…"
                  className="pl-8 w-56"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
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
                  <SelectValue />
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
                    disabled={pendingFilteredIds.length === 0}
                    aria-label="Select all pending"
                  />
                </TableHead>
                <TableHead>Faculty</TableHead>
                <TableHead className="hidden sm:table-cell">Form</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
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
                      />
                    </TableCell>
                    <TableCell className="font-medium">{s.faculty}</TableCell>
                    <TableCell className="hidden sm:table-cell">{s.form}</TableCell>
                    <TableCell className="hidden md:table-cell">{s.date}</TableCell>
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
                        <Button variant="ghost" size="icon" title="Download" onClick={() => onDownload(s)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        {s.status === "Pending" && (
                          <>
                            <Button variant="ghost" size="icon" title="Approve" onClick={() => onApprove(s)}>
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Reject" onClick={() => openReject([s])}>
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
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
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
        onDownload={(s) => onDownload(rows.find((r) => r.id === s.id)!)}
        onApprove={(s) => onApprove(rows.find((r) => r.id === s.id)!)}
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

export default HodSubmissions;
