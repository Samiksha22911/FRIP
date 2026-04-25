/**
 * HOD → My Research.
 *
 * Shows HOD's own publications submitted via the three built-in forms,
 * lets HOD submit a new one, and surfaces rejection feedback. Mirrors the
 * Faculty "My Forms" workflow so HODs can record their own scholarly output.
 */
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BuiltInFormsPicker from "@/components/publication-forms/BuiltInFormsPicker";
import PublicationsTable from "@/components/PublicationsTable";
import RejectedSubmissions from "@/components/RejectedSubmissions";
import ResearchLibrary from "@/components/ResearchLibrary";
import { usePublications } from "@/lib/publications";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("fri-user") || "{}");
  } catch {
    return {};
  }
};

const HodMyResearch = () => {
  const [open, setOpen] = useState(false);
  const all = usePublications();
  const user = getStoredUser();
  const email = user.email || "hod@fri.edu";
  const facultyName = user.name || "HOD User";
  const department = user.department || "Department Office";

  const mine = useMemo(
    () => all.filter((p) => p.submittedBy.toLowerCase() === email.toLowerCase()),
    [all, email]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">My Research</h1>
          <p className="text-muted-foreground mt-1">
            Your own research papers, books, chapters and conference papers — submit and track approvals.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> New publication
        </Button>
      </div>

      <RejectedSubmissions facultyName={facultyName} />

      <PublicationsTable
        rows={mine}
        title="My submissions"
        description="Every publication you've submitted via Journal, Conference, or Book form."
      />

      <ResearchLibrary
        scope="hod"
        title="HOD research library (sample data)"
        description="Other HODs' research output across departments."
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">New publication</DialogTitle>
          </DialogHeader>
          <BuiltInFormsPicker
            submitterEmail={email}
            submitterRole="hod"
            defaultFaculty={facultyName}
            defaultDepartment={department}
            onSubmitted={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HodMyResearch;
