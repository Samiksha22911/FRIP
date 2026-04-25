/**
 * Built-in **Conference Paper** publication form.
 *
 * Mandatory: indexing, faculty name, department, collaboration, number of
 * authors, corresponding author, MITS author position, author 1 (name + aff),
 * paper title, conference name, publication house, year, DOI, citation.
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
  type ConferencePublication,
  type IndexingConference,
} from "@/lib/publications";
import { AuthorsEditor, COLLAB_OPTIONS, CountSelect, Field, FormActions } from "./FormBits";

const INDEXING: IndexingConference[] = ["Scopus", "Web of Science"];
const currentYear = new Date().getFullYear();

interface Props {
  defaultFaculty?: string;
  defaultDepartment?: string;
  submitterEmail: string;
  submitterRole: "faculty" | "hod";
  onSubmitted?: () => void;
  onCancel?: () => void;
}

export const ConferencePaperForm = ({
  defaultFaculty = "",
  defaultDepartment = "",
  submitterEmail,
  submitterRole,
  onSubmitted,
  onCancel,
}: Props) => {
  const [indexing, setIndexing] = useState<IndexingConference>("Scopus");
  const [facultyName, setFacultyName] = useState(defaultFaculty);
  const [department, setDepartment] = useState(defaultDepartment);
  const [collaboration, setCollaboration] = useState<typeof COLLAB_OPTIONS[number]>("Individual work");
  const [numAuthors, setNumAuthors] = useState(1);
  const [corresponding, setCorresponding] = useState<"Yes" | "No">("Yes");
  const [mitsPos, setMitsPos] = useState(1);
  const [authors, setAuthors] = useState<ConferencePublication["authors"]>([
    { name: "", affiliation: "MITS Scholar" },
  ]);
  const [paperTitle, setPaperTitle] = useState("");
  const [conferenceName, setConferenceName] = useState("");
  const [publicationHouse, setPublicationHouse] = useState("");
  const [volume, setVolume] = useState("");
  const [paperNumber, setPaperNumber] = useState("");
  const [year, setYear] = useState(currentYear);
  const [doi, setDoi] = useState("");
  const [url, setUrl] = useState("");
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
    if (!conferenceName.trim()) e.conferenceName = "Conference name is required";
    if (!publicationHouse.trim()) e.publicationHouse = "Publication house is required";
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
    const pub: ConferencePublication = {
      id: newId(),
      kind: "conference",
      indexing,
      facultyName: facultyName.trim(),
      department: department.trim(),
      collaboration,
      numberOfAuthors: numAuthors,
      correspondingAuthor: corresponding,
      mitsAuthorPosition: mitsPos,
      authors,
      paperTitle: paperTitle.trim(),
      conferenceName: conferenceName.trim(),
      publicationHouse: publicationHouse.trim(),
      volume,
      paperNumber,
      year,
      doi: doi.trim(),
      url: url.trim() || undefined,
      citation: citation.trim(),
      status: "Pending",
      submittedBy: submitterEmail,
      submitterRole,
      submittedAt: new Date().toISOString(),
    };
    publicationsStore.add(pub);
    toast.success("Conference paper submitted for review");
    onSubmitted?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-serif">Indexing & faculty</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Field id="cIndexing" label="Conference paper indexing" required>
            <Select value={indexing} onValueChange={(v) => setIndexing(v as IndexingConference)}>
              <SelectTrigger id="cIndexing"><SelectValue /></SelectTrigger>
              <SelectContent>
                {INDEXING.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field id="cFaculty" label="Faculty name" required error={errors.facultyName}>
            <Input id="cFaculty" value={facultyName} onChange={(e) => setFacultyName(e.target.value)} />
          </Field>
          <Field id="cDept" label="Department" required error={errors.department}>
            <Input id="cDept" value={department} onChange={(e) => setDepartment(e.target.value)} />
          </Field>
          <Field id="cCollab" label="Publication collaboration" required className="sm:col-span-2">
            <Select value={collaboration} onValueChange={(v) => setCollaboration(v as typeof collaboration)}>
              <SelectTrigger id="cCollab"><SelectValue /></SelectTrigger>
              <SelectContent>
                {COLLAB_OPTIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <CountSelect id="cNum" label="Number of authors" required value={numAuthors} onChange={setNumAuthors} />
          <Field id="cCorr" label="Corresponding author?" required>
            <Select value={corresponding} onValueChange={(v) => setCorresponding(v as "Yes" | "No")}>
              <SelectTrigger id="cCorr"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <CountSelect id="cMits" label="MITS faculty author position" required value={mitsPos} onChange={setMitsPos} />
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
          <Field id="cTitle" label="Paper title" required error={errors.paperTitle} className="sm:col-span-2">
            <Input id="cTitle" value={paperTitle} onChange={(e) => setPaperTitle(e.target.value)} />
          </Field>
          <Field id="cConf" label="Conference name" required error={errors.conferenceName}>
            <Input id="cConf" value={conferenceName} onChange={(e) => setConferenceName(e.target.value)} />
          </Field>
          <Field id="cHouse" label="Publication house" required error={errors.publicationHouse}>
            <Input id="cHouse" value={publicationHouse} onChange={(e) => setPublicationHouse(e.target.value)} />
          </Field>
          <Field id="cVol" label="Conference volume">
            <Input id="cVol" value={volume} onChange={(e) => setVolume(e.target.value)} />
          </Field>
          <Field id="cPaperNo" label="Paper number">
            <Input id="cPaperNo" value={paperNumber} onChange={(e) => setPaperNumber(e.target.value)} />
          </Field>
          <Field id="cYear" label="Published year" required>
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger id="cYear"><SelectValue /></SelectTrigger>
              <SelectContent>
                {yearOptions.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field id="cDoi" label="DOI" required error={errors.doi} hint="DOI or URL is required">
            <Input id="cDoi" value={doi} onChange={(e) => setDoi(e.target.value)} />
          </Field>
          <Field id="cUrl" label="URL of published paper">
            <Input id="cUrl" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </Field>
          <Field id="cCit" label="Citation (MLA / APA)" required error={errors.citation} className="sm:col-span-2">
            <Textarea id="cCit" rows={3} value={citation} onChange={(e) => setCitation(e.target.value)} />
          </Field>
        </CardContent>
      </Card>

      <FormActions onCancel={onCancel} submitLabel="Submit conference paper" />
    </form>
  );
};

export default ConferencePaperForm;
