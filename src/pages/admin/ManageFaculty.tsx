import { Search, Filter, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const facultyData = [
  { id: 1, name: "Dr. Priya Sharma", dept: "CSE", email: "priya@fri.edu", papers: 14, status: "Active" },
  { id: 2, name: "Dr. Amit Kumar", dept: "ECE", email: "amit@fri.edu", papers: 22, status: "Active" },
  { id: 3, name: "Dr. Neha Singh", dept: "ME", email: "neha@fri.edu", papers: 9, status: "Active" },
  { id: 4, name: "Dr. Raj Patel", dept: "IT", email: "raj@fri.edu", papers: 18, status: "Inactive" },
  { id: 5, name: "Dr. Meera Joshi", dept: "CE", email: "meera@fri.edu", papers: 11, status: "Active" },
  { id: 6, name: "Dr. Vikram Reddy", dept: "CSE", email: "vikram@fri.edu", papers: 26, status: "Active" },
  { id: 7, name: "Dr. Anjali Gupta", dept: "EE", email: "anjali@fri.edu", papers: 7, status: "Active" },
];

const ManageFaculty = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Manage Faculty</h1>
        <p className="text-muted-foreground mt-1">View and manage all registered faculty members.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4">
          <CardTitle className="text-base font-serif">Faculty List</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search faculty..." className="pl-8 w-56" />
            </div>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Department</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Papers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facultyData.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{f.dept}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{f.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{f.papers}</TableCell>
                  <TableCell>
                    <Badge variant={f.status === "Active" ? "default" : "secondary"}>{f.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
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

export default ManageFaculty;
