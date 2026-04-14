import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const forms = [
  { id: 1, title: "Research Paper 2024", deadline: "2024-04-01", status: "Not Started", description: "Submit details of research papers published in 2024." },
  { id: 2, title: "Conference Attendance", deadline: "2024-03-25", status: "In Progress", description: "Record conferences attended this academic year." },
  { id: 3, title: "Book Publication Record", deadline: "2024-04-15", status: "Not Started", description: "Log any books or chapters published." },
  { id: 4, title: "Patent Filing 2024", deadline: "2024-05-01", status: "Submitted", description: "Submit patent application details." },
];

const MyForms = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">My Forms</h1>
      <p className="text-muted-foreground mt-1">View and fill assigned research forms.</p>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      {forms.map((f) => (
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
);

export default MyForms;
