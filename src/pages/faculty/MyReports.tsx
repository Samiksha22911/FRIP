import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

const reports = [
  { id: 1, form: "Research Paper 2023", submitted: "2023-12-15", status: "Approved", score: 92 },
  { id: 2, form: "Conference Attendance 2023", submitted: "2023-11-20", status: "Approved", score: 85 },
  { id: 3, form: "Book Publication 2023", submitted: "2023-10-10", status: "Approved", score: 78 },
  { id: 4, form: "Patent Filing 2023", submitted: "2024-01-05", status: "Pending", score: null },
];

const MyReports = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">My Reports</h1>
      <p className="text-muted-foreground mt-1">View your submission history and research impact scores.</p>
    </div>

    <div className="grid sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-5 text-center">
          <BarChart3 className="h-6 w-6 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold font-serif text-foreground">Rank #12</div>
          <p className="text-xs text-muted-foreground">Department Ranking</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5 text-center">
          <div className="text-2xl font-bold font-serif text-foreground">85</div>
          <p className="text-xs text-muted-foreground">Average Score</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5 text-center">
          <div className="text-2xl font-bold font-serif text-foreground">14</div>
          <p className="text-xs text-muted-foreground">Total Publications</p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-serif">Submission History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form</TableHead>
              <TableHead className="hidden sm:table-cell">Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.form}</TableCell>
                <TableCell className="hidden sm:table-cell">{r.submitted}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "Approved" ? "default" : "secondary"}>{r.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell font-serif font-bold">{r.score ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default MyReports;
