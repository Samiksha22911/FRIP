import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const notifications = [
  { id: 1, message: "New form assigned: Research Paper 2024", time: "2 hours ago", read: false },
  { id: 2, message: "Your submission for Conference Attendance was approved by HOD", time: "1 day ago", read: false },
  { id: 3, message: "Deadline reminder: Conference form due in 3 days", time: "2 days ago", read: true },
  { id: 4, message: "Admin sent a new message: Complete pending submissions", time: "3 days ago", read: true },
  { id: 5, message: "Your Patent Filing submission is under review", time: "5 days ago", read: true },
];

const FacultyNotifications = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Notifications</h1>
      <p className="text-muted-foreground mt-1">Stay updated with form assignments and submission statuses.</p>
    </div>

    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-serif">All Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className={`p-3 rounded-lg border transition-colors ${n.read ? "border-border hover:bg-muted/50" : "border-accent/30 bg-accent/5"}`}>
            <div className="flex items-start gap-2">
              {!n.read && <span className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />}
              <div>
                <p className="text-sm text-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default FacultyNotifications;
