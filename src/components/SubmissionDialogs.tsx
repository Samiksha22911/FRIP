import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, FileText } from "lucide-react";
import type { ResearchItemType, SubmissionStatus } from "@/lib/api";

export interface SubmissionDetails {
  id: string | number;
  faculty: string;
  authorRole?: "hod" | "faculty";
  form: string;
  type: ResearchItemType;
  dept?: string;
  date: string;
  status: SubmissionStatus;
  fileName?: string;
  fileSize?: string;
  abstract?: string;
}

/* ---------------- View Details Modal ---------------- */
interface ViewDetailsProps {
  submission: SubmissionDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: (s: SubmissionDetails) => void;
  onApprove?: (s: SubmissionDetails) => void;
  onReject?: (s: SubmissionDetails) => void;
}

export const ViewDetailsDialog = ({
  submission,
  open,
  onOpenChange,
  onDownload,
  onApprove,
  onReject,
}: ViewDetailsProps) => {
  if (!submission) return null;
  const s = submission;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif">{s.form}</DialogTitle>
          <DialogDescription>Submission details preview</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Author" value={s.faculty} />
          <Field label="Role" value={s.authorRole?.toUpperCase() || "—"} />
          <Field label="Type" value={s.type} />
          <Field label="Department" value={s.dept || "—"} />
          <Field label="Submitted" value={s.date} />
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
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
          </div>
        </div>
        <div className="rounded-md border bg-muted/30 p-3 flex items-start gap-3">
          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {s.fileName || `${s.form.replace(/[^a-z0-9]+/gi, "_")}.pdf`}
            </p>
            <p className="text-xs text-muted-foreground">{s.fileSize || "Document attached"}</p>
          </div>
          {onDownload && (
            <Button size="sm" variant="outline" className="gap-1" onClick={() => onDownload(s)}>
              <Download className="h-3 w-3" /> Download
            </Button>
          )}
        </div>
        {s.abstract && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Abstract</p>
            <p className="text-sm leading-relaxed">{s.abstract}</p>
          </div>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {s.status === "Pending" && onReject && (
            <Button
              variant="destructive"
              onClick={() => {
                onOpenChange(false);
                onReject(s);
              }}
            >
              Reject
            </Button>
          )}
          {s.status === "Pending" && onApprove && (
            <Button
              onClick={() => {
                onOpenChange(false);
                onApprove(s);
              }}
            >
              Approve
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="font-medium capitalize">{value}</p>
  </div>
);

/* ---------------- Reject With Reason Modal ---------------- */
interface RejectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Title shown in the dialog (single submission title or e.g. "5 submissions") */
  subjectLabel: string;
  onConfirm: (reason: string) => void;
}

export const RejectReasonDialog = ({ open, onOpenChange, subjectLabel, onConfirm }: RejectProps) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
      setError("");
    }
  }, [open]);

  const submit = () => {
    const trimmed = reason.trim();
    if (trimmed.length < 5) {
      setError("Please provide a reason (at least 5 characters).");
      return;
    }
    if (trimmed.length > 500) {
      setError("Reason must be under 500 characters.");
      return;
    }
    onConfirm(trimmed);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Reject Submission</DialogTitle>
          <DialogDescription>
            Provide a clear reason for rejecting <span className="font-medium">{subjectLabel}</span>.
            The author will see it in their reports and can edit/resubmit.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="reject-reason">Rejection reason *</Label>
          <Textarea
            id="reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Missing DOI / abstract too short / wrong publication year…"
            className="min-h-[110px]"
            maxLength={500}
          />
          <div className="flex justify-between text-xs">
            <span className={error ? "text-destructive" : "text-muted-foreground"}>
              {error || `${reason.length}/500 characters`}
            </span>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={submit}>
            Confirm Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
