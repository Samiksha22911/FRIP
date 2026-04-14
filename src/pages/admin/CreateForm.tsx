import { useState } from "react";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type FieldType = "text" | "textarea" | "number" | "date" | "select" | "file";

interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string;
}

const CreateForm = () => {
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [fields, setFields] = useState<FormField[]>([
    { id: "1", label: "", type: "text", required: true },
  ]);

  const addField = () => {
    setFields([...fields, { id: Date.now().toString(), label: "", type: "text", required: false }]);
  };

  const removeField = (id: string) => {
    if (fields.length === 1) return;
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleSave = () => {
    if (!formTitle.trim()) {
      toast.error("Please enter a form title");
      return;
    }
    toast.success("Form saved successfully! (Connect backend to persist)");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Create Form</h1>
        <p className="text-muted-foreground mt-1">Design a dynamic form for faculty submissions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-serif">Form Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Form Title</Label>
            <Input placeholder="e.g., Research Paper Submission 2024" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Describe the purpose of this form..." value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Deadline</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-serif">Form Fields</CardTitle>
          <Button size="sm" variant="outline" onClick={addField}>
            <Plus className="h-4 w-4 mr-1" /> Add Field
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, idx) => (
            <div key={field.id} className="flex gap-3 items-start p-3 rounded-lg border border-border bg-muted/30">
              <GripVertical className="h-5 w-5 text-muted-foreground mt-2 flex-shrink-0 cursor-grab" />
              <div className="flex-1 grid sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Input
                    placeholder={`Field ${idx + 1} label`}
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                  />
                </div>
                <Select value={field.type} onValueChange={(v: FieldType) => updateField(field.id, { type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="textarea">Textarea</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Dropdown</SelectItem>
                    <SelectItem value="file">File Upload</SelectItem>
                  </SelectContent>
                </Select>
                {field.type === "select" && (
                  <div className="sm:col-span-3">
                    <Input
                      placeholder="Options (comma-separated)"
                      value={field.options || ""}
                      onChange={(e) => updateField(field.id, { options: e.target.value })}
                    />
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeField(field.id)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" /> Save Form
        </Button>
        <Button variant="outline">Preview</Button>
      </div>
    </div>
  );
};

export default CreateForm;
