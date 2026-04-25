/**
 * Faculty → My Forms.
 *
 * Shows the dynamic forms assigned by Admin **plus** the three built-in
 * publication forms (Journal, Conference, Book / Chapter). Faculty can
 * submit a publication and see all of their own submissions with status.
 */
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BuiltInFormsPicker from "@/components/publication-forms/BuiltInFormsPicker";
import PublicationsTable from "@/components/PublicationsTable";
import RejectedSubmissions from "@/components/RejectedSubmissions";
import { usePublications } from "@/lib/publications";

const dynamicForms = [
  { id: 1, title: "Research Paper 2024", deadline: "2024-04-01", status: "Not Started", description: "Submit details of research papers published in 2024." },
  { id: 2, title: "Conference Attendance", deadline: "2024-03-25", status: "In Progress", description: "Record conferences attended this academic year." },
  { id: 3, title: "Book Publication Record", deadline: "2024-04-15", status: "Not Started", description: "Log any books or chapters published." },
  { id: 4, title: "Patent Filing 2024", deadline: "2024-05-01", status: "Submitted", description: "Submit patent application details." },
];

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("fri-user") || "{}");
  } catch {
    return {};
  }
};

const MyForms = () => {
  const [open, setOpen] = useState(false);
  const all = usePublications();
  const user = getStoredUser();
  const email = user.email || "faculty@fri.edu";
  const facultyName = user.name || "Faculty User";
  const department = user.department || "Faculty Department";

  const mine = useMemo(
    () => all.filter((p) => p.submittedBy.toLowerCase() === email.toLowerCase()),
    [all, email]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">My Forms</h1>
          <p className="text-muted-foreground mt-1">Submit publications using built-in or admin-assigned forms.</p>
        </div>
        <Button className="gap-2" onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" /> New publication
        </Button>
      </div>

      <RejectedSubmissions facultyName={facultyName} />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-serif">Built-in publication forms</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-3 gap-3">
          {[
            { kind: "Journal Paper", desc: "SCI / SCIE / ESCI / Scopus / Web of Science." },
            { kind: "Conference Paper", desc: "Scopus / Web of Science indexed conferences." },
            { kind: "Book / Book Chapter", desc: "Books and chapters with ISBN, publisher info." },
          ].map((f) => (
            <button
              key={f.kind}
              type="button"
              onClick={() => setOpen(true)}
              className="text-left rounded-lg border border-border bg-card p-4 hover:border-primary transition-colors"
            >
              <p className="font-serif font-semibold text-sm">{f.kind}</p>
              <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              <p className="text-xs text-primary mt-2 font-medium">Open form →</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <PublicationsTable
        rows={mine}
        title="My publication submissions"
        description="Track approval status of every publication you've submitted."
      />

      <div>
        <h2 className="font-serif font-semibold text-lg mb-3">Admin-assigned forms</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {dynamicForms.map((f) => (
            <Card key={f.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-serif">{f.title}</CardTitle>
                  <Badge variant={f.status === "Submitted" ? "default" : f.status === "In Progress" ? "secondary" : "outline"}>
                    {f.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{f.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Due: {f.deadline}</span>
                  <Button size="sm" variant={f.status === "Submitted" ? "outline" : "default"} className="gap-1">
                    <FileText className="h-3 w-3" />
                    {f.status === "Submitted" ? "View" : f.status === "In Progress" ? "Continue" : "Fill Form"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">New publication</DialogTitle>
          </DialogHeader>
          <BuiltInFormsPicker
            submitterEmail={email}
            submitterRole="faculty"
            defaultFaculty={facultyName}
            defaultDepartment={department}
            onSubmitted={() => setOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyForms;
