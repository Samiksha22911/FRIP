import { Users, Clock, CheckCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { api, type DashboardStats, type ActivityEntry } from "@/lib/api";
import ActivityFeed from "@/components/ActivityFeed";

const stats = [
  { label: "Total Faculty", value: "32", icon: Users },
  { label: "Pending Approvals", value: "8", icon: Clock },
  { label: "Approved Reports", value: "187", icon: CheckCircle },
];

const facultySubmissions = [
  { id: 1, name: "Dr. Priya Sharma", form: "Research Paper 2024", date: "2024-03-15", status: "Pending" },
  { id: 2, name: "Dr. Amit Kumar", form: "Conference Attendance", date: "2024-03-14", status: "Pending" },
  { id: 3, name: "Dr. Neha Singh", form: "Book Publication", date: "2024-03-14", status: "Pending" },
  { id: 4, name: "Dr. Raj Patel", form: "Research Paper 2024", date: "2024-03-13", status: "Approved" },
  { id: 5, name: "Dr. Meera Joshi", form: "Patent Filing", date: "2024-03-12", status: "Approved" },
];

const HodDashboardHome = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({ totalFaculty: 32, pendingSubmissions: 8, approvedReports: 187 });
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    api.dashboardStats("hod").then(setDashboardStats);
    api.activity("hod").then(setActivity);
  }, []);

  const liveStats = stats.map((stat) => ({
    ...stat,
    value: stat.label === "Total Faculty" ? String(dashboardStats.totalFaculty ?? 0) : stat.label === "Pending Approvals" ? String(dashboardStats.pendingSubmissions ?? 0) : String(dashboardStats.approvedReports ?? 0),
  }));

  const handleAction = (name: string, action: string) => {
    toast.success(`${action} submission from ${name}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">HOD Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor your department's research output and manage approvals.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {liveStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs md:text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className="h-4 w-4 text-accent" />
              </div>
              <div className="text-xl md:text-2xl font-bold font-serif text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-serif">Faculty Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty</TableHead>
                  <TableHead className="hidden sm:table-cell">Form</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facultySubmissions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{s.form}</TableCell>
                    <TableCell className="hidden md:table-cell">{s.date}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "Approved" ? "default" : "secondary"}>{s.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {s.status === "Pending" ? (
                        <div className="flex gap-1">
                          <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => handleAction(s.name, "Approved")}>
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => handleAction(s.name, "Rejected")}>
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <ActivityFeed items={activity} />
      </div>
    </div>
  );
};

export default HodDashboardHome;
