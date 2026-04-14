import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const faculty = [
  { id: 1, name: "Dr. Priya Sharma", email: "priya@fri.edu", papers: 14, rank: 3, status: "Active" },
  { id: 2, name: "Dr. Amit Kumar", email: "amit@fri.edu", papers: 22, rank: 1, status: "Active" },
  { id: 3, name: "Dr. Neha Singh", email: "neha@fri.edu", papers: 9, rank: 5, status: "Active" },
  { id: 4, name: "Dr. Raj Patel", email: "raj@fri.edu", papers: 18, rank: 2, status: "Active" },
  { id: 5, name: "Dr. Meera Joshi", email: "meera@fri.edu", papers: 11, rank: 4, status: "On Leave" },
];

const FacultyList = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Faculty List</h1>
      <p className="text-muted-foreground mt-1">View all faculty in your department.</p>
    </div>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-serif">Department Faculty</CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8 w-48" />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Papers</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {faculty.map((f) => (
              <TableRow key={f.id}>
                <TableCell className="font-serif font-bold text-accent">#{f.rank}</TableCell>
                <TableCell className="font-medium">{f.name}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{f.email}</TableCell>
                <TableCell>{f.papers}</TableCell>
                <TableCell>
                  <Badge variant={f.status === "Active" ? "default" : "secondary"}>{f.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default FacultyList;
