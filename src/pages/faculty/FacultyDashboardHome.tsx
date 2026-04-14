import { Clock, CheckCircle, FileText, Bell, MessageSquare, CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Pending Forms", value: "3", icon: Clock },
  { label: "Submitted Forms", value: "11", icon: FileText },
  { label: "Approved Reports", value: "8", icon: CheckCircle },
];

const latestForms = [
  { id: 1, title: "Research Paper 2024", deadline: "2024-04-01", status: "Open" },
  { id: 2, title: "Conference Attendance", deadline: "2024-03-25", status: "Urgent" },
  { id: 3, title: "Book Publication Record", deadline: "2024-04-15", status: "Open" },
];

const notifications = [
  { id: 1, message: "New form assigned: Research Paper 2024", time: "2 hours ago", read: false },
  { id: 2, message: "Your submission for Conference Attendance was approved", time: "1 day ago", read: false },
  { id: 3, message: "Deadline reminder: Conference form due in 3 days", time: "2 days ago", read: true },
];

const adminMessages = [
  { id: 1, subject: "Important: Complete pending submissions", date: "2024-03-15" },
  { id: 2, subject: "New research tracking policy update", date: "2024-03-10" },
];

const FacultyDashboardHome = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Faculty Dashboard</h1>
      <p className="text-muted-foreground mt-1">Track your research submissions and view your impact score.</p>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => (
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

    <div className="grid md:grid-cols-2 gap-4">
      {/* Latest Forms */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-serif flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-accent" /> Latest Forms with Deadline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {latestForms.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground">Due: {f.deadline}</p>
              </div>
              <Badge variant={f.status === "Urgent" ? "destructive" : "secondary"}>{f.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-serif flex items-center gap-2">
            <Bell className="h-4 w-4 text-accent" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className={`p-3 rounded-lg border transition-colors ${n.read ? "border-border" : "border-accent/30 bg-accent/5"}`}>
              <p className="text-sm text-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>

    {/* Admin Messages */}
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-serif flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-accent" /> Admin Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {adminMessages.map((m) => (
          <div key={m.id} className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
            <p className="text-sm font-medium text-foreground">{m.subject}</p>
            <p className="text-xs text-muted-foreground">{m.date}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default FacultyDashboardHome;
