/**
 * Reusable, filterable table of `Publication` rows. Used by Admin (with
 * approve/reject), Faculty/HOD (their own), and the Student portal
 * (browse + search).
 */
import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Check, X, ExternalLink, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  publicationsStore,
  KIND_LABEL,
  type Publication,
  type PublicationKind,
  type PublicationStatus,
} from "@/lib/publications";
import PublicationDetailsDialog from "./PublicationDetailsDialog";

interface Props {
  rows: Publication[];
  title?: string;
  description?: string;
  /** Show approve / reject / delete actions (Admin only). */
  manageActions?: boolean;
  /** Callback when admin approves/rejects — receives the updated publication. */
  onApprove?: (p: Publication) => void;
  onReject?: (p: Publication) => void;
  /** Hide the search/filter row (e.g. when embedded in a larger filtered view). */
  hideFilters?: boolean;
}

const KIND_FILTERS: { value: PublicationKind | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "journal", label: "Journal" },
  { value: "conference", label: "Conference" },
  { value: "book", label: "Book / Chapter" },
];

const STATUS_FILTERS: { value: PublicationStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

export const PublicationsTable = ({
  rows,
  title = "Publications",
  description,
  manageActions,
  onApprove,
  onReject,
  hideFilters,
}: Props) => {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<PublicationKind | "all">("all");
  const [status, setStatus] = useState<PublicationStatus | "all">("all");
  const [viewing, setViewing] = useState<Publication | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return rows.filter((p) => {
      if (kind !== "all" && p.kind !== kind) return false;
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      const haystack = [
        p.paperTitle,
        p.facultyName,
        p.department,
        p.publicationHouse,
        p.citation,
        ...p.authors.map((a) => a.name),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [rows, query, kind, status]);

  const handleDelete = (p: Publication) => {
    publicationsStore.remove(p.id);
    toast.success(`Removed: ${p.paperTitle}`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-serif">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {!hideFilters && (
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search title, faculty, author…"
                  className="pl-8 w-60"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Select value={kind} onValueChange={(v) => setKind(v as typeof kind)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KIND_FILTERS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTERS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Faculty</TableHead>
              <TableHead className="hidden lg:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium max-w-[26ch]">
                  <div className="truncate">{p.paperTitle}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {p.kind === "journal" ? p.journalName : p.kind === "conference" ? p.conferenceName : p.publisherName}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {p.facultyName}
                  {p.submitterRole === "hod" && (
                    <Badge variant="outline" className="ml-2 text-[10px]">HOD</Badge>
                  )}
                  <div className="text-xs text-muted-foreground">{p.department}</div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{KIND_LABEL[p.kind]}</TableCell>
                <TableCell className="hidden lg:table-cell">{p.year}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      p.status === "Approved" ? "default" : p.status === "Rejected" ? "destructive" : "secondary"
                    }
                  >
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" title="View" onClick={() => setViewing(p)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noreferrer" title="Open URL" className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {manageActions && p.status === "Pending" && (
                      <>
                        <Button variant="ghost" size="icon" title="Approve" onClick={() => onApprove?.(p)}>
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Reject" onClick={() => onReject?.(p)}>
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </>
                    )}
                    {manageActions && (
                      <Button variant="ghost" size="icon" title="Delete" onClick={() => handleDelete(p)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No publications match.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <PublicationDetailsDialog publication={viewing} open={!!viewing} onOpenChange={(o) => !o && setViewing(null)} />
    </Card>
  );
};

export default PublicationsTable;
