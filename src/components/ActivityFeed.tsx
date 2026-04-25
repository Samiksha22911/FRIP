import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityEntry } from "@/lib/api";
import { Activity } from "lucide-react";

const ActivityFeed = ({ items }: { items: ActivityEntry[] }) => (
  <Card>
    <CardHeader className="pb-2 flex flex-row items-center gap-2">
      <Activity className="h-4 w-4 text-accent" />
      <CardTitle className="text-base font-serif">Recent Activity</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {items.length === 0 && <p className="text-sm text-muted-foreground">No recent activity.</p>}
      {items.map((a) => (
        <div key={a.id} className="flex items-start gap-3 text-sm">
          <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-foreground">
              <span className="font-medium">{a.actor}</span>{" "}
              <span className="text-muted-foreground">{a.action}</span>{" "}
              <span className="font-medium">{a.target}</span>
            </p>
            <p className="text-xs text-muted-foreground">{a.at}</p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

export default ActivityFeed;
