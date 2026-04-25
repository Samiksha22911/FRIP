import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const readUser = () => {
  try { return JSON.parse(localStorage.getItem("fri-user") || "{}"); } catch { return {}; }
};

interface ProfilePageProps {
  role: "admin" | "hod";
  defaults: {
    name: string;
    email: string;
    institute: string;
    department: string;
    designation: string;
    phone: string;
    employeeId: string;
  };
  summary?: { label: string; value: string | number }[];
}

const ProfilePage = ({ role, defaults, summary }: ProfilePageProps) => {
  const [form, setForm] = useState(defaults);

  useEffect(() => {
    const u = readUser();
    setForm((f) => ({
      ...f,
      name: u.name || f.name,
      email: u.email || f.email,
      institute: u.institute || u.institution || f.institute,
      department: u.department || f.department,
    }));
  }, []);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const save = () => {
    const stored = readUser();
    localStorage.setItem("fri-user", JSON.stringify({ ...stored, ...form }));
    toast.success("Profile updated!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your {role === "admin" ? "administrator" : "HOD"} information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-serif">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name} onChange={update("name")} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={update("email")} type="email" />
            </div>
            <div className="space-y-2">
              <Label>Institute</Label>
              <Input value={form.institute} onChange={update("institute")} />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Input value={form.department} onChange={update("department")} />
            </div>
            <div className="space-y-2">
              <Label>Designation</Label>
              <Input value={form.designation} onChange={update("designation")} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={form.phone} onChange={update("phone")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Employee ID</Label>
              <Input value={form.employeeId} onChange={update("employeeId")} />
            </div>
          </div>
          <Button onClick={save}>Save Changes</Button>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-serif">{role === "admin" ? "Portal Overview" : "Research Summary"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              {summary.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold font-serif text-foreground">{s.value}</div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
