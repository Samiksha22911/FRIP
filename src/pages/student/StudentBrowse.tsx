/**
 * Student → Browse publications.
 *
 * Students see every **approved** publication across all departments and
 * can search by title, faculty name, or keyword (author / venue).
 */
import { useMemo } from "react";
import PublicationsTable from "@/components/PublicationsTable";
import { usePublications } from "@/lib/publications";

const StudentBrowse = () => {
  const all = usePublications();
  const approved = useMemo(() => all.filter((p) => p.status === "Approved"), [all]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Browse Publications</h1>
        <p className="text-muted-foreground mt-1">
          Explore approved research from all faculty and HODs across the institute.
        </p>
      </div>
      <PublicationsTable
        rows={approved}
        title={`${approved.length} approved publications`}
        description="Search by title, faculty name, author, journal or conference."
      />
    </div>
  );
};

export default StudentBrowse;
