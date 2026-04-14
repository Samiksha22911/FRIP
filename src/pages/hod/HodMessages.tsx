import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

const messages = [
  { id: 1, from: "Admin", subject: "New Form: Research Paper 2024", date: "2024-03-15", read: false },
  { id: 2, from: "Admin", subject: "Deadline Extended for Conference Form", date: "2024-03-12", read: true },
  { id: 3, from: "Admin", subject: "Monthly Report Submission Required", date: "2024-03-10", read: true },
  { id: 4, from: "System", subject: "3 pending approvals awaiting review", date: "2024-03-09", read: false },
];

const HodMessages = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Messages</h1>
      <p className="text-muted-foreground mt-1">Notifications and messages from admin.</p>
    </div>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-serif">Inbox</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={`p-3 rounded-lg border transition-colors cursor-pointer ${m.read ? "border-border hover:bg-muted/50" : "border-accent/30 bg-accent/5 hover:bg-accent/10"}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                {!m.read && <span className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />}
                <div>
                  <p className="text-sm font-medium text-foreground">{m.subject}</p>
                  <p className="text-xs text-muted-foreground">From: {m.from} · {m.date}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
);

export default HodMessages;
