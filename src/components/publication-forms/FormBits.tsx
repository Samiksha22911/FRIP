/**
 * Shared sub-components used by all three built-in publication forms.
 * Keeps repetitive markup (author rows, collaboration / author counts, etc.)
 * in one place so the three forms stay focused on their own fields.
 */
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { Author, CollaborationType } from "@/lib/publications";

export const COLLAB_OPTIONS: CollaborationType[] = [
  "Individual work",
  "Collaboration work",
  "Interdisciplinary within institute",
  "Interdisciplinary with other institute",
  "Collaboration with foreign authors",
  "Publication with MITS student",
  "Other",
];

export const RequiredMark = () => <span className="text-destructive ml-0.5">*</span>;

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  className?: string;
}

export const Field = ({ id, label, required, children, error, hint, className }: FieldProps) => (
  <div className={`space-y-1.5 ${className || ""}`}>
    <Label htmlFor={id} className="text-sm">
      {label}
      {required && <RequiredMark />}
    </Label>
    {children}
    {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

interface AuthorsEditorProps {
  count: number;
  authors: Author[];
  onAuthorsChange: (next: Author[]) => void;
  errors?: Record<number, Partial<Record<keyof Author, string>>>;
  /** which author indices must be filled (0-based). */
  requiredIndices?: number[];
}

export const AuthorsEditor = ({
  count,
  authors,
  onAuthorsChange,
  errors,
  requiredIndices = [0],
}: AuthorsEditorProps) => {
  // Keep authors array length in sync with declared author count.
  useEffect(() => {
    if (authors.length === count) return;
    const next = [...authors];
    while (next.length < count) next.push({ name: "", affiliation: "MITS Scholar" });
    while (next.length > count) next.pop();
    onAuthorsChange(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const update = (i: number, patch: Partial<Author>) => {
    const next = authors.map((a, idx) => (idx === i ? { ...a, ...patch } : a));
    onAuthorsChange(next);
  };

  return (
    <div className="space-y-3">
      {authors.map((a, i) => {
        const required = requiredIndices.includes(i);
        const err = errors?.[i] || {};
        return (
          <div
            key={i}
            className="rounded-lg border bg-muted/30 p-3 space-y-3"
          >
            <p className="text-xs font-medium text-foreground/80">
              Author {i + 1}
              {required && <RequiredMark />}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field id={`author-${i}-name`} label="Name" required={required} error={err.name}>
                <Input
                  id={`author-${i}-name`}
                  value={a.name}
                  onChange={(e) => update(i, { name: e.target.value })}
                  placeholder="e.g. Dr. Priya Sharma"
                />
              </Field>
              <Field id={`author-${i}-aff`} label="Affiliation (institute name in paper)" required={required} error={err.affiliation}>
                <Select value={a.affiliation} onValueChange={(v) => update(i, { affiliation: v })}>
                  <SelectTrigger id={`author-${i}-aff`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MITS Scholar">MITS Scholar</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            {a.affiliation === "Other" && (
              <Field id={`author-${i}-aff-detail`} label="Other affiliation — name">
                <Input
                  id={`author-${i}-aff-detail`}
                  value={a.affiliationDetail || ""}
                  onChange={(e) => update(i, { affiliationDetail: e.target.value })}
                  placeholder="e.g. IIT Delhi"
                />
              </Field>
            )}
          </div>
        );
      })}
    </div>
  );
};

interface CountSelectProps {
  id: string;
  label: string;
  required?: boolean;
  value: number;
  onChange: (n: number) => void;
  max?: number;
  min?: number;
  error?: string;
}

export const CountSelect = ({ id, label, required, value, onChange, max = 10, min = 1, error }: CountSelectProps) => (
  <Field id={id} label={label} required={required} error={error}>
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger id={id}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((n) => (
          <SelectItem key={n} value={String(n)}>
            {n}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </Field>
);

export const FormActions = ({
  onCancel,
  submitting,
  submitLabel = "Submit publication",
}: {
  onCancel?: () => void;
  submitting?: boolean;
  submitLabel?: string;
}) => (
  <div className="flex items-center gap-2 pt-2">
    <Button type="submit" disabled={submitting}>
      {submitting ? "Submitting…" : submitLabel}
    </Button>
    {onCancel && (
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    )}
  </div>
);

export const AddAuthorButton = () => (
  <Button type="button" variant="outline" size="sm" className="gap-1">
    <Plus className="h-3.5 w-3.5" /> Add author
  </Button>
);

export const TrashButton = ({ onClick }: { onClick: () => void }) => (
  <Button type="button" variant="ghost" size="icon" onClick={onClick}>
    <Trash2 className="h-4 w-4 text-destructive" />
  </Button>
);
