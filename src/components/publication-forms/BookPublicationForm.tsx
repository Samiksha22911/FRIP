/**
 * Built-in **Book / Book Chapter** publication form.
 *
 * Mandatory: publication type, indexing, faculty name, department,
 * collaboration, number of authors, corresponding author, MITS author
 * position, author 1 (name + aff), title of publication, name of publisher,
 * year, ISBN, DOI/URL, citation.
 */
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  publicationsStore,
  newId,
  type BookPublication,
  type BookType,
} from "@/lib/publications";
import { AuthorsEditor, COLLAB_OPTIONS, CountSelect, Field, FormActions } from "./FormBits";

const TYPES: BookType[] = ["Book", "Book Chapter"];
const currentYear = new Date().getFullYear();

interface Props {
  defaultFaculty?: string;
  defaultDepartment?: string;
  submitterEmail: string;
  submitterRole: "faculty" | "hod";
  onSubmitted?: () => void;
  onCancel?: () => void;
}

export const BookPublicationForm = ({
  defaultFaculty = "",
  defaultDepartment = "",
  submitterEmail,
  submitterRole,
  onSubmitted,
  onCancel,
}: Props) => {
  const [publicationType, setPublicationType] = useState<BookType>("Book");
  const [indexing, setIndexing] = useState("Scopus");
  const [facultyName, setFacultyName] = useState(defaultFaculty);
  const [department, setDepartment] = useState(defaultDepartment);
  const [collaboration, setCollaboration] = useState<typeof COLLAB_OPTIONS[number]>("Individual work");
  const [numAuthors, setNumAuthors] = useState(1);
  const [corresponding, setCorresponding] = useState<"Yes" | "No">("Yes");
  const [mitsPos, setMitsPos] = useState(1);
  const [authors, setAuthors] = useState<BookPublication["authors"]>([
    { name: "", affiliation: "MITS Scholar" },
  ]);
  const [title, setTitle] = useState("");
  const [publisherName, setPublisherName] = useState("");
  const [volume, setVolume] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [year, setYear] = useState(currentYear);
  const [isbn, setIsbn] = useState("");
  const [doi, setDoi] = useState("");
  const [url, setUrl] = useState("");
  const [citation, setCitation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const yearOptions = useMemo(
    () => Array.from({ length: 50 }, (_, i) => currentYear - i),
    []
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!facultyName.trim()) e.facultyName = "Faculty name is required";
    if (!department.trim()) e.department = "Department is required";
    if (!authors[0]?.name?.trim()) e.author0Name = "Author 1 name is required";
    if (!authors[0]?.affiliation?.trim()) e.author0Aff = "Author 1 affiliation is required";
    if (!title.trim()) e.title = "Title of publication is required";
    if (!publisherName.trim()) e.publisherName = "Name of publisher is required";
    if (!isbn.trim()) e.isbn = "ISBN number is required";
    if (!doi.trim() && !url.trim()) e.doi = "DOI or URL is required";
    if (!citation.trim()) e.citation = "Citation is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required (*) fields");
      return;
    }
    const pub: BookPublication = {
      id: newId(),
      kind: "book",
      publicationType,
      indexing,
      facultyName: facultyName.trim(),
      department: department.trim(),
      collaboration,
      numberOfAuthors: numAuthors,
      correspondingAuthor: corresponding,
      mitsAuthorPosition: mitsPos,
      authors,
      paperTitle: title.trim(),
      publisherName: publisherName.trim(),
      publicationHouse: publisherName.trim(),
      volume,
      pageNumber,
      year,
      isbn: isbn.trim(),
      doi: doi.trim(),
      url: url.trim() || undefined,
      citation: citation.trim(),
      status: "Pending",
      submittedBy: submitterEmail,
      submitterRole,
      submittedAt: new Date().toISOString(),
    };
    publicationsStore.add(pub);
    toast.success("Book / chapter submitted for review");
    onSubmitted?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-serif">Publication type</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field id="bType" label="Publication type" required>
            <Select value={publicationType} onValueChange={(v) => setPublicationType(v as BookType)}>
              <SelectTrigger id="bType"><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field id="bIdx" label="Publication indexing" required>
            <Input id="bIdx" value={indexing} onChange={(e) => setIndexing(e.target.value)} placeholder="e.g. Scopus, Web of Science" />
          </Field>
          <Field id="bFaculty" label="Faculty name" required error={errors.facultyName}>
            <Input id="bFaculty" value={facultyName} onChange={(e) => setFacultyName(e.target.value)} />
          </Field>
          <Field id="bDept" label="Department" required error={errors.department}>
            <Input id="bDept" value={department} onChange={(e) => setDepartment(e.target.value)} />
          </Field>
          <Field id="bCollab" label="Publication collaboration" required className="sm:col-span-2">
            <Select value={collaboration} onValueChange={(v) => setCollaboration(v as typeof collaboration)}>
              <SelectTrigger id="bCollab"><SelectValue /></SelectTrigger>
              <SelectContent>
                {COLLAB_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <CountSelect id="bNum" label="Number of authors" required value={numAuthors} onChange={setNumAuthors} />
          <Field id="bCorr" label="Corresponding author?" required>
            <Select value={corresponding} onValueChange={(v) => setCorresponding(v as "Yes" | "No")}>
              <SelectTrigger id="bCorr"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <CountSelect id="bMits" label="MITS faculty author position" required value={mitsPos} onChange={setMitsPos} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-serif">Authors</CardTitle>
        </CardHeader>
        <CardContent>
          <AuthorsEditor
            count={numAuthors}
            authors={authors}
            onAuthorsChange={setAuthors}
            errors={{ 0: { name: errors.author0Name, affiliation: errors.author0Aff } }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-serif">Publication details</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field id="bTitle" label="Title of publication" required error={errors.title} className="sm:col-span-2">
            <Input id="bTitle" value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field id="bPublisher" label="Name of publisher" required error={errors.publisherName}>
            <Input id="bPublisher" value={publisherName} onChange={(e) => setPublisherName(e.target.value)} />
          </Field>
          <Field id="bVol" label="Book volume">
            <Input id="bVol" value={volume} onChange={(e) => setVolume(e.target.value)} />
          </Field>
          <Field id="bPage" label="Page number">
            <Input id="bPage" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} />
          </Field>
          <Field id="bYear" label="Publication year" required>
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger id="bYear"><SelectValue /></SelectTrigger>
              <SelectContent>
                {yearOptions.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field id="bIsbn" label="ISBN number" required error={errors.isbn}>
            <Input id="bIsbn" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
          </Field>
          <Field id="bDoi" label="DOI" required error={errors.doi} hint="DOI or URL is required">
            <Input id="bDoi" value={doi} onChange={(e) => setDoi(e.target.value)} />
          </Field>
          <Field id="bUrl" label="URL of published paper">
            <Input id="bUrl" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </Field>
          <Field id="bCit" label="Citation (MLA / APA)" required error={errors.citation} className="sm:col-span-2">
            <Textarea id="bCit" rows={3} value={citation} onChange={(e) => setCitation(e.target.value)} />
          </Field>
        </CardContent>
      </Card>

      <FormActions onCancel={onCancel} submitLabel="Submit book / chapter" />
    </form>
  );
};

export default BookPublicationForm;
