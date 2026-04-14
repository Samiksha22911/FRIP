import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const submissions = [
  { id: 1, faculty: "Dr. Priya Sharma", form: "Research Paper 2024", date: "2024-03-15", status: "Approved" },
  { id: 2, faculty: "Dr. Amit Kumar", form: "Conference Attendance", date: "2024-03-14", status: "Approved" },
  { id: 3, faculty: "Dr. Neha Singh", form: "Book Publication", date: "2024-03-14", status: "Pending" },
  { id: 4, faculty: "Dr. Raj Patel", form: "Research Paper 2024", date: "2024-03-13", status: "Rejected" },
];

const HodSubmissions = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Submissions</h1>
      <p className="text-muted-foreground mt-1">Review all submissions from your department.</p>
    </div>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-serif">All Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Faculty</TableHead>
              <TableHead className="hidden sm:table-cell">Form</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.faculty}</TableCell>
                <TableCell className="hidden sm:table-cell">{s.form}</TableCell>
                <TableCell className="hidden md:table-cell">{s.date}</TableCell>
                <TableCell>
                  <Badge variant={s.status === "Approved" ? "default" : s.status === "Rejected" ? "destructive" : "secondary"}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default HodSubmissions;
