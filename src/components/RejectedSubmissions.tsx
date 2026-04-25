import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Pencil } from "lucide-react";
import { rejectionStore, type RejectionRecord, type Role } from "@/lib/api";
import { toast } from "sonner";

interface Props {
  /** Optionally filter by the current user's name to only show their own rejected items */
  facultyName?: string;
  /** Optional override of rejection sources to display (e.g. only ones rejected by admin) */
  rejectedBy?: Role[];
}

const RejectedSubmissions = ({ facultyName, rejectedBy }: Props) => {
  const [items, setItems] = useState<RejectionRecord[]>([]);

  const refresh = () => {
    let all = rejectionStore.all();
    if (facultyName) all = all.filter((r) => r.faculty === facultyName);
    if (rejectedBy?.length) all = all.filter((r) => rejectedBy.includes(r.rejectedBy));
    all.sort((a, b) => (a.rejectedAt < b.rejectedAt ? 1 : -1));
    setItems(all);
  };

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("fri-rejections-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("fri-rejections-changed", handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facultyName, rejectedBy?.join(",")]);

  if (items.length === 0) return null;

  const handleResubmit = (rec: RejectionRecord) => {
    rejectionStore.clear(rec.id);
    toast.success(`Ready to edit & resubmit: ${rec.title || "submission"}`);
  };

  return (
    <Card className="border-destructive/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-serif flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          Rejected Submissions — Action Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((rec) => (
          <div
            key={rec.id}
            className="rounded-md border bg-destructive/5 p-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <p className="font-medium text-sm truncate">{rec.title || `Submission #${rec.id}`}</p>
                <Badge variant="destructive" className="text-[10px]">Rejected</Badge>
                <Badge variant="outline" className="text-[10px]">
                  by {rec.rejectedBy.toUpperCase()}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-1">
                {new Date(rec.rejectedAt).toLocaleString()}
              </p>
              <p className="text-sm">
                <span className="font-medium">Reason: </span>
                {rec.reason}
              </p>
            </div>
            <Button size="sm" className="gap-1 shrink-0" onClick={() => handleResubmit(rec)}>
              <Pencil className="h-3 w-3" /> Edit & Resubmit
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RejectedSubmissions;
