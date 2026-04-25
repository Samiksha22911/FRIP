import { type FormEvent, useState } from "react";
import { Edit, Search, Filter, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type FacultyMember = {
  id: number;
  name: string;
  dept: string;
  email: string;
  papers: number;
  status: "Active" | "Inactive";
};

const facultyData: FacultyMember[] = [
  { id: 1, name: "Dr. Priya Sharma", dept: "CSE", email: "priya@fri.edu", papers: 14, status: "Active" },
  { id: 2, name: "Dr. Amit Kumar", dept: "ECE", email: "amit@fri.edu", papers: 22, status: "Active" },
  { id: 3, name: "Dr. Neha Singh", dept: "ME", email: "neha@fri.edu", papers: 9, status: "Active" },
  { id: 4, name: "Dr. Raj Patel", dept: "IT", email: "raj@fri.edu", papers: 18, status: "Inactive" },
  { id: 5, name: "Dr. Meera Joshi", dept: "CE", email: "meera@fri.edu", papers: 11, status: "Active" },
  { id: 6, name: "Dr. Vikram Reddy", dept: "CSE", email: "vikram@fri.edu", papers: 26, status: "Active" },
  { id: 7, name: "Dr. Anjali Gupta", dept: "EE", email: "anjali@fri.edu", papers: 7, status: "Active" },
];

const ManageFaculty = () => {
  const [faculty, setFaculty] = useState(facultyData);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(null);

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingFaculty) return;

    const formData = new FormData(event.currentTarget);
    const updatedFaculty: FacultyMember = {
      ...editingFaculty,
      name: String(formData.get("name") || editingFaculty.name),
      dept: String(formData.get("dept") || editingFaculty.dept),
      email: String(formData.get("email") || editingFaculty.email),
      papers: Number(formData.get("papers") || editingFaculty.papers),
      status: String(formData.get("status") || editingFaculty.status) as FacultyMember["status"],
    };

    setFaculty((current) => current.map((item) => (item.id === updatedFaculty.id ? updatedFaculty : item)));
    setEditingFaculty(null);
  };

  const handleDeleteFaculty = (id: number) => {
    setFaculty((current) => current.filter((item) => item.id !== id));
  };

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
              {faculty.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{f.dept}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{f.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{f.papers}</TableCell>
                  <TableCell>
                    <Badge variant={f.status === "Active" ? "default" : "secondary"}>{f.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditingFaculty(f)} aria-label={`Edit ${f.name}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteFaculty(f.id)} aria-label={`Delete ${f.name}`}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingFaculty} onOpenChange={(open) => !open && setEditingFaculty(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Faculty</DialogTitle>
            <DialogDescription>Update faculty details for the admin portal.</DialogDescription>
          </DialogHeader>
          {editingFaculty && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="faculty-name">Name</Label>
                <Input id="faculty-name" name="name" defaultValue={editingFaculty.name} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faculty-dept">Department</Label>
                <Input id="faculty-dept" name="dept" defaultValue={editingFaculty.dept} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faculty-email">Email</Label>
                <Input id="faculty-email" name="email" type="email" defaultValue={editingFaculty.email} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faculty-papers">Papers</Label>
                <Input id="faculty-papers" name="papers" type="number" min="0" defaultValue={editingFaculty.papers} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faculty-status">Status</Label>
                <select id="faculty-status" name="status" defaultValue={editingFaculty.status} className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingFaculty(null)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageFaculty;
