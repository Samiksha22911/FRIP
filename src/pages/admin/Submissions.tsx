import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Eye, Download } from "lucide-react";

const submissions = [
  { id: 1, faculty: "Dr. Priya Sharma", form: "Research Paper 2024", dept: "CSE", date: "2024-03-15", status: "Pending" },
  { id: 2, faculty: "Dr. Amit Kumar", form: "Conference Attendance", dept: "ECE", date: "2024-03-14", status: "Approved" },
  { id: 3, faculty: "Dr. Neha Singh", form: "Book Publication", dept: "ME", date: "2024-03-14", status: "Pending" },
  { id: 4, faculty: "Dr. Raj Patel", form: "Research Paper 2024", dept: "IT", date: "2024-03-13", status: "Approved" },
  { id: 5, faculty: "Dr. Meera Joshi", form: "Patent Filing", dept: "CE", date: "2024-03-12", status: "Rejected" },
  { id: 6, faculty: "Dr. Vikram Reddy", form: "Research Paper 2024", dept: "CSE", date: "2024-03-11", status: "Approved" },
];

const Submissions = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Submission Reports</h1>
        <p className="text-muted-foreground mt-1">View and manage all faculty submissions.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
          <CardTitle className="text-base font-serif">All Submissions</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search submissions..." className="pl-8 w-56" />
            </div>
            <Button variant="outline" size="sm" className="gap-1"><Download className="h-4 w-4" /> Export</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faculty</TableHead>
                <TableHead className="hidden sm:table-cell">Form</TableHead>
                <TableHead className="hidden md:table-cell">Dept</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.faculty}</TableCell>
                  <TableCell className="hidden sm:table-cell">{s.form}</TableCell>
                  <TableCell className="hidden md:table-cell">{s.dept}</TableCell>
                  <TableCell className="hidden lg:table-cell">{s.date}</TableCell>
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
};

export default Submissions;
