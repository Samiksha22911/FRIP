/**
 * Read-only details dialog for a publication. Used in Admin / HOD / Student
 * portals to preview every field before approve / reject / mentor-suggest.
 */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Publication } from "@/lib/publications";
import { KIND_LABEL } from "@/lib/publications";

interface Props {
  publication: Publication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const Row = ({ label, value }: { label: string; value: React.ReactNode }) =>
  value === undefined || value === null || value === "" ? null : (
    <div className="grid grid-cols-3 gap-3 py-1.5 text-sm border-b border-border/40 last:border-0">
      <div className="text-muted-foreground">{label}</div>
      <div className="col-span-2 text-foreground break-words">{value}</div>
    </div>
  );

export const PublicationDetailsDialog = ({ publication, open, onOpenChange }: Props) => {
  if (!publication) return null;
  const p = publication;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg pr-6">
            {p.paperTitle}
          </DialogTitle>
          <div className="flex items-center gap-2 pt-2">
            <Badge variant="outline">{KIND_LABEL[p.kind]}</Badge>
            <Badge
              variant={
                p.status === "Approved" ? "default" : p.status === "Rejected" ? "destructive" : "secondary"
              }
            >
              {p.status}
            </Badge>
            {p.submitterRole === "hod" && <Badge variant="outline">HOD submission</Badge>}
          </div>
        </DialogHeader>

        <div className="mt-4">
          <Row label="Faculty" value={p.facultyName} />
          <Row label="Department" value={p.department} />
          <Row label="Collaboration" value={p.collaboration} />
          <Row label="No. of authors" value={p.numberOfAuthors} />
          <Row label="Corresponding author" value={p.correspondingAuthor} />
          <Row label="MITS author position" value={p.mitsAuthorPosition} />
          <Row
            label="Authors"
            value={
              <ol className="list-decimal pl-4 space-y-0.5">
                {p.authors.map((a, i) => (
                  <li key={i}>
                    {a.name || "—"}{" "}
                    <span className="text-muted-foreground">
                      ({a.affiliation === "Other" ? a.affiliationDetail || "Other" : a.affiliation})
                    </span>
                  </li>
                ))}
              </ol>
            }
          />

          {p.kind === "journal" && (
            <>
              <Row label="Indexing" value={p.indexing} />
              <Row label="Category" value={p.category} />
              <Row label="Journal" value={p.journalName} />
              <Row label="Publication house" value={p.publicationHouse} />
              <Row label="Volume" value={p.volume} />
              <Row label="Issue" value={p.issueNumber} />
              <Row label="Pages" value={p.pageNumber} />
              <Row label="Month / Year" value={`${p.publicationMonth} ${p.year}`} />
              <Row label="ISSN" value={p.issn} />
              <Row label="DOI" value={p.doi} />
              <Row label="URL" value={p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="text-primary underline">{p.url}</a> : null} />
              <Row label="Impact factor" value={p.impactFactor} />
            </>
          )}

          {p.kind === "conference" && (
            <>
              <Row label="Indexing" value={p.indexing} />
              <Row label="Conference" value={p.conferenceName} />
              <Row label="Publication house" value={p.publicationHouse} />
              <Row label="Volume" value={p.volume} />
              <Row label="Paper number" value={p.paperNumber} />
              <Row label="Year" value={p.year} />
              <Row label="DOI" value={p.doi} />
              <Row label="URL" value={p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="text-primary underline">{p.url}</a> : null} />
            </>
          )}

          {p.kind === "book" && (
            <>
              <Row label="Type" value={p.publicationType} />
              <Row label="Indexing" value={p.indexing} />
              <Row label="Publisher" value={p.publisherName} />
              <Row label="Volume" value={p.volume} />
              <Row label="Page number" value={p.pageNumber} />
              <Row label="Year" value={p.year} />
              <Row label="ISBN" value={p.isbn} />
              <Row label="DOI" value={p.doi} />
              <Row label="URL" value={p.url ? <a href={p.url} target="_blank" rel="noreferrer" className="text-primary underline">{p.url}</a> : null} />
            </>
          )}

          <Row label="Citation" value={<span className="italic">{p.citation}</span>} />
          {p.status === "Rejected" && p.rejectionReason && (
            <Row label="Rejection reason" value={<span className="text-destructive">{p.rejectionReason}</span>} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublicationDetailsDialog;
