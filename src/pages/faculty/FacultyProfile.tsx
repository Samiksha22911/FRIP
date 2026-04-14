import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FacultyProfile = () => (
  <div className="space-y-6 max-w-2xl">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Profile</h1>
      <p className="text-muted-foreground mt-1">Manage your personal and academic information.</p>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="text-base font-serif">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input defaultValue="Dr. Priya Sharma" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue="priya@fri.edu" type="email" disabled />
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Input defaultValue="Computer Science & Engineering" disabled />
          </div>
          <div className="space-y-2">
            <Label>Designation</Label>
            <Input defaultValue="Associate Professor" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input defaultValue="+91 98765 43210" />
          </div>
          <div className="space-y-2">
            <Label>Employee ID</Label>
            <Input defaultValue="FRI-CSE-042" disabled />
          </div>
        </div>
        <Button onClick={() => toast.success("Profile updated!")}>Save Changes</Button>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="text-base font-serif">Research Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold font-serif text-foreground">14</div>
            <p className="text-xs text-muted-foreground">Papers</p>
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-foreground">3</div>
            <p className="text-xs text-muted-foreground">Books</p>
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-foreground">2</div>
            <p className="text-xs text-muted-foreground">Patents</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default FacultyProfile;
