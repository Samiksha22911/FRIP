import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const reportData = [
  { faculty: "Dr. Amit", papers: 22 },
  { faculty: "Dr. Raj", papers: 18 },
  { faculty: "Dr. Priya", papers: 14 },
  { faculty: "Dr. Meera", papers: 11 },
  { faculty: "Dr. Neha", papers: 9 },
];

const HodReports = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Reports</h1>
      <p className="text-muted-foreground mt-1">Department research analytics and rankings.</p>
    </div>

    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-serif">Faculty Research Output</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={reportData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis dataKey="faculty" type="category" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={80} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            <Bar dataKey="papers" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  </div>
);

export default HodReports;
