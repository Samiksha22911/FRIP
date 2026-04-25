/**
 * Built-in **Journal Paper** publication form.
 *
 * Mandatory fields per spec:
 *  - Indexing, Category, Faculty name, Department, Collaboration type,
 *    Number of authors, Corresponding author, MITS author position,
 *    Author 1 name + affiliation, Paper title, Journal name,
 *    Publication house, Publication month + year, ISSN, DOI,
 *    Current impact factor, Citation.
 */
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  newId,
  type JournalPublication,
  type IndexingJournal,
  type JournalCategory,
} from "@/lib/publications";
import {
  AuthorsEditor,
  COLLAB_OPTIONS,
  CountSelect,
  Field,
  FormActions,
} from "./FormBits";

const INDEXING: IndexingJournal[] = ["SCI", "SCIE", "ESCI", "Scopus", "Web of Science"];
const CATEGORIES: JournalCategory[] = ["Q1", "Q2", "Q3", "Q4", "Nil"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const currentYear = new Date().getFullYear();

interface Props {
  defaultFaculty?: string;
  defaultDepartment?: string;
  submitterEmail: string;
  submitterRole: "faculty" | "hod";
  onSubmitted?: () => void;
  onCancel?: () => void;
}

export const JournalPaperForm = ({
  defaultFaculty = "",
  defaultDepartment = "",
  submitterEmail,
  submitterRole,
  onSubmitted,
  onCancel,
}: Props) => {
  const [indexing, setIndexing] = useState<IndexingJournal>("SCI");
  const [category, setCategory] = useState<JournalCategory>("Q1");
  const [facultyName, setFacultyName] = useState(defaultFaculty);
  const [department, setDepartment] = useState(defaultDepartment);
  const [collaboration, setCollaboration] = useState<typeof COLLAB_OPTIONS[number]>("Individual work");
  const [numAuthors, setNumAuthors] = useState(1);
  const [corresponding, setCorresponding] = useState<"Yes" | "No">("Yes");
  const [mitsPos, setMitsPos] = useState(1);
  const [authors, setAuthors] = useState<JournalPublication["authors"]>([
    { name: "", affiliation: "MITS Scholar" },
  ]);
  const [paperTitle, setPaperTitle] = useState("");
  const [journalName, setJournalName] = useState("");
  const [publicationHouse, setPublicationHouse] = useState("");
  const [volume, setVolume] = useState("");
  const [issueNumber, setIssueNumber] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [publicationMonth, setPublicationMonth] = useState(MONTHS[new Date().getMonth()]);
  const [year, setYear] = useState(currentYear);
  const [issn, setIssn] = useState("");
  const [doi, setDoi] = useState("");
  const [url, setUrl] = useState("");
  const [impactFactor, setImpactFactor] = useState("");
  const [citation, setCitation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const yearOptions = useMemo(
    () => Array.from({ length: 30 }, (_, i) => currentYear - i),
    []
  );

  const validate = () => {
    const e: Record<string, string> = {};
    if (!facultyName.trim()) e.facultyName = "Faculty name is required";
    if (!department.trim()) e.department = "Department is required";
    if (!authors[0]?.name?.trim()) e.author0Name = "Author 1 name is required";
    if (!authors[0]?.affiliation?.trim()) e.author0Aff = "Author 1 affiliation is required";
    if (!paperTitle.trim()) e.paperTitle = "Paper title is required";
    if (!journalName.trim()) e.journalName = "Journal name is required";
    if (!publicationHouse.trim()) e.publicationHouse = "Publication house is required";
    if (!issn.trim()) e.issn = "ISSN is required";
    if (!doi.trim()) e.doi = "DOI is required";
    if (!impactFactor.trim()) e.impactFactor = "Current impact factor is required";
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
    const pub: JournalPublication = {
      id: newId(),
      kind: "journal",
      indexing,
      category,
      facultyName: facultyName.trim(),
      department: department.trim(),
      collaboration,
      numberOfAuthors: numAuthors,
      correspondingAuthor: corresponding,
      mitsAuthorPosition: mitsPos,
      authors,
      paperTitle: paperTitle.trim(),
      journalName: journalName.trim(),
      publicationHouse: publicationHouse.trim(),
      volume,
      issueNumber,
      pageNumber,
      publicationMonth,
      year,
      issn: issn.trim(),
      doi: doi.trim(),
      url: url.trim() || undefined,
      impactFactor: impactFactor.trim(),
      citation: citation.trim(),
      status: "Pending",
      submittedBy: submitterEmail,
      submitterRole,
      submittedAt: new Date().toISOString(),
    };
    publicationsStore.add(pub);
    toast.success("Journal paper submitted for review");
    onSubmitted?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-serif">Journal indexing & category</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field id="indexing" label="Journal indexing" required>
            <Select value={indexing} onValueChange={(v) => setIndexing(v as IndexingJournal)}>
              <SelectTrigger id="indexing"><SelectValue /></SelectTrigger>
              <SelectContent>
                {INDEXING.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field id="category" label="Journal category" required>
            <Select value={category} onValueChange={(v) => setCategory(v as JournalCategory)}>
              <SelectTrigger id="category"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-serif">Faculty & collaboration</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field id="facultyName" label="Faculty name" required error={errors.facultyName}>
            <Input id="facultyName" value={facultyName} onChange={(e) => setFacultyName(e.target.value)} />
          </Field>
          <Field id="department" label="Department" required error={errors.department}>
            <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. CSE" />
          </Field>
          <Field id="collab" label="Publication collaboration" required className="sm:col-span-2">
            <Select value={collaboration} onValueChange={(v) => setCollaboration(v as typeof collaboration)}>
              <SelectTrigger id="collab"><SelectValue /></SelectTrigger>
              <SelectContent>
                {COLLAB_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <CountSelect id="numAuthors" label="Number of authors" required value={numAuthors} onChange={setNumAuthors} max={10} />
          <Field id="corresp" label="Corresponding author?" required>
            <Select value={corresponding} onValueChange={(v) => setCorresponding(v as "Yes" | "No")}>
              <SelectTrigger id="corresp"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <CountSelect id="mitsPos" label="MITS faculty author position" required value={mitsPos} onChange={setMitsPos} max={10} />
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
          <Field id="paperTitle" label="Paper title" required error={errors.paperTitle} className="sm:col-span-2">
            <Input id="paperTitle" value={paperTitle} onChange={(e) => setPaperTitle(e.target.value)} />
          </Field>
          <Field id="journalName" label="Journal name" required error={errors.journalName}>
            <Input id="journalName" value={journalName} onChange={(e) => setJournalName(e.target.value)} />
          </Field>
          <Field id="publicationHouse" label="Publication house" required error={errors.publicationHouse}>
            <Input id="publicationHouse" value={publicationHouse} onChange={(e) => setPublicationHouse(e.target.value)} placeholder="e.g. IEEE, Springer" />
          </Field>
          <Field id="volume" label="Paper volume">
            <Input id="volume" value={volume} onChange={(e) => setVolume(e.target.value)} />
          </Field>
          <Field id="issue" label="Paper issue number">
            <Input id="issue" value={issueNumber} onChange={(e) => setIssueNumber(e.target.value)} />
          </Field>
          <Field id="page" label="Page number">
            <Input id="page" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} placeholder="e.g. 1024-1038" />
          </Field>
          <Field id="month" label="Publication month" required>
            <Select value={publicationMonth} onValueChange={setPublicationMonth}>
              <SelectTrigger id="month"><SelectValue /></SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field id="year" label="Year" required>
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger id="year"><SelectValue /></SelectTrigger>
              <SelectContent>
                {yearOptions.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field id="issn" label="ISSN number" required error={errors.issn}>
            <Input id="issn" value={issn} onChange={(e) => setIssn(e.target.value)} placeholder="e.g. 2169-3536" />
          </Field>
          <Field id="doi" label="DOI (digital object identifier)" required error={errors.doi}>
            <Input id="doi" value={doi} onChange={(e) => setDoi(e.target.value)} />
          </Field>
          <Field id="url" label="URL of published paper">
            <Input id="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </Field>
          <Field id="impact" label="Current impact factor of journal" required error={errors.impactFactor}>
            <Input id="impact" value={impactFactor} onChange={(e) => setImpactFactor(e.target.value)} />
          </Field>
          <Field id="citation" label="Citation (MLA / APA)" required error={errors.citation} className="sm:col-span-2">
            <Textarea id="citation" rows={3} value={citation} onChange={(e) => setCitation(e.target.value)} />
          </Field>
        </CardContent>
      </Card>

      <FormActions onCancel={onCancel} submitLabel="Submit journal paper" />
    </form>
  );
};

export default JournalPaperForm;
