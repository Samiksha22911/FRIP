import { Users, FileText, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { api, type DashboardStats, type ActivityEntry } from "@/lib/api";
import ActivityFeed from "@/components/ActivityFeed";

const stats = [
  { label: "Total Faculty", value: "248", icon: Users, change: "+12 this month" },
  { label: "Forms Created", value: "18", icon: FileText, change: "3 active" },
  { label: "Pending Submissions", value: "64", icon: Clock, change: "12 new today" },
  { label: "Approved Reports", value: "1,247", icon: CheckCircle, change: "+89 this week" },
];

const deptData = [
  { dept: "CSE", submissions: 245 },
  { dept: "ECE", submissions: 198 },
  { dept: "ME", submissions: 156 },
  { dept: "CE", submissions: 134 },
  { dept: "EE", submissions: 112 },
  { dept: "IT", submissions: 189 },
];

const monthlyData = [
  { month: "Jan", activity: 120 },
  { month: "Feb", activity: 145 },
  { month: "Mar", activity: 178 },
  { month: "Apr", activity: 156 },
  { month: "May", activity: 210 },
  { month: "Jun", activity: 234 },
];

const recentSubmissions = [
  { id: 1, faculty: "Dr. Priya Sharma", dept: "CSE", form: "Research Paper 2024", date: "2024-03-15", status: "Pending" },
  { id: 2, faculty: "Dr. Amit Kumar", dept: "ECE", form: "Conference Attendance", date: "2024-03-14", status: "Approved" },
  { id: 3, faculty: "Dr. Neha Singh", dept: "ME", form: "Book Publication", date: "2024-03-14", status: "Pending" },
  { id: 4, faculty: "Dr. Raj Patel", dept: "IT", form: "Research Paper 2024", date: "2024-03-13", status: "Approved" },
  { id: 5, faculty: "Dr. Meera Joshi", dept: "CE", form: "Patent Filing", date: "2024-03-12", status: "Rejected" },
];

const AdminDashboardHome = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({ totalFaculty: 248, formsCreated: 18, pendingSubmissions: 64, approvedReports: 1247 });
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    api.dashboardStats("admin").then(setDashboardStats);
    api.activity("admin").then(setActivity);
  }, []);

  const liveStats = stats.map((stat) => ({
    ...stat,
    value: stat.label === "Total Faculty" ? String(dashboardStats.totalFaculty ?? 0) : stat.label === "Forms Created" ? String(dashboardStats.formsCreated ?? 0) : stat.label === "Pending Submissions" ? String(dashboardStats.pendingSubmissions ?? 0) : String(dashboardStats.approvedReports ?? 0),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage forms, users, and view institution-wide analytics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {liveStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs md:text-sm text-muted-foreground">{stat.label}</span>
                <stat.icon className="h-4 w-4 text-accent" />
              </div>
              <div className="text-xl md:text-2xl font-bold font-serif text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-serif">Submissions per Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="dept" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="submissions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-serif">Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="activity" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-serif">Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Faculty</TableHead>
                  <TableHead className="hidden sm:table-cell">Department</TableHead>
                  <TableHead className="hidden md:table-cell">Form</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentSubmissions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.faculty}</TableCell>
                    <TableCell className="hidden sm:table-cell">{s.dept}</TableCell>
                    <TableCell className="hidden md:table-cell">{s.form}</TableCell>
                    <TableCell className="hidden lg:table-cell">{s.date}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "Approved" ? "default" : s.status === "Rejected" ? "destructive" : "secondary"}>
                        {s.status}
                      </Badge>
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

export default AdminDashboardHome;
