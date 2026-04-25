/**
 * Admin → Built-in Forms.
 *
 * Lists the three institute-standard publication forms (Journal, Conference,
 * Book / Chapter) and shows every publication submitted through them with
 * approve / reject / delete controls. This is separate from the dynamic
 * "Create Form" page, which is for ad-hoc admin-created forms.
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Mic } from "lucide-react";
import { toast } from "sonner";
import {
  publicationsStore,
  usePublications,
  KIND_LABEL,
  type Publication,
  type PublicationKind,
} from "@/lib/publications";
import PublicationsTable from "@/components/PublicationsTable";
import {
  RejectReasonDialog,
} from "@/components/SubmissionDialogs";

const FORMS: { kind: PublicationKind; icon: React.ElementType; description: string; required: string }[] = [
  {
    kind: "journal",
    icon: FileText,
    description: "Journal paper publication — indexing, category, ISSN, impact factor, and more.",
    required: "Indexing, Category, Faculty, Department, Collaboration, # of authors, Corresponding author, MITS position, Author 1, Title, Journal name, Publication house, Month + Year, ISSN, DOI, Impact factor, Citation",
  },
  {
    kind: "conference",
    icon: Mic,
    description: "Conference paper publication — indexing, conference name, paper number, year.",
    required: "Indexing, Faculty, Department, Collaboration, # of authors, Corresponding author, MITS position, Author 1, Title, Conference name, Publication house, Year, DOI / URL, Citation",
  },
  {
    kind: "book",
    icon: BookOpen,
    description: "Book and book chapter publication — publisher, ISBN, indexing, year.",
    required: "Type, Indexing, Faculty, Department, Collaboration, # of authors, Corresponding author, MITS position, Author 1, Title, Publisher, Year, ISBN, DOI / URL, Citation",
  },
];

const BuiltInForms = () => {
  const rows = usePublications();
  const [rejectTarget, setRejectTarget] = useState<Publication | null>(null);

  const handleApprove = (p: Publication) => {
    publicationsStore.setStatus(p.id, "Approved");
    toast.success(`Approved: ${p.paperTitle}`);
  };

  const handleConfirmReject = (reason: string) => {
    if (!rejectTarget) return;
    publicationsStore.setStatus(rejectTarget.id, "Rejected", reason);
    toast.success(`Rejected: ${rejectTarget.paperTitle}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Built-in Forms</h1>
        <p className="text-muted-foreground mt-1">
          Three institute-standard publication forms used by Faculty and HOD. Use the
          dynamic <span className="font-medium">Create Form</span> page for ad-hoc forms.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {FORMS.map((f) => {
          const count = rows.filter((r) => r.kind === f.kind).length;
          const pending = rows.filter((r) => r.kind === f.kind && r.status === "Pending").length;
          return (
            <Card key={f.kind}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                      <f.icon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-serif">{KIND_LABEL[f.kind]}</CardTitle>
                  </div>
                  {pending > 0 && (
                    <Badge variant="secondary">{pending} pending</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p className="text-muted-foreground">{f.description}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Total submissions: </span>{count}
                </p>
                <details className="text-xs">
                  <summary className="cursor-pointer text-foreground/80 hover:text-foreground">
                    Required fields
                  </summary>
                  <p className="mt-2 text-muted-foreground">{f.required}</p>
                </details>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <PublicationsTable
        rows={rows}
        title="All publication submissions"
        description="Approve, reject, view details or delete entries from any of the three built-in forms."
        manageActions
        onApprove={handleApprove}
        onReject={(p) => setRejectTarget(p)}
      />

      <RejectReasonDialog
        open={!!rejectTarget}
        onOpenChange={(o) => !o && setRejectTarget(null)}
        subjectLabel={rejectTarget?.paperTitle || ""}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
};

export default BuiltInForms;
