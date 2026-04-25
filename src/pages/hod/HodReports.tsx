import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { API_BASE_URL, api, downloadReportPdf, downloadResearchItem, type PublishedPaper } from "@/lib/api";

const reportData = [
  { faculty: "Dr. Amit", papers: 22 },
  { faculty: "Dr. Raj", papers: 18 },
  { faculty: "Dr. Priya", papers: 14 },
  { faculty: "Dr. Meera", papers: 11 },
  { faculty: "Dr. Neha", papers: 9 },
];

const HodReports = () => {
  const [papers, setPapers] = useState<PublishedPaper[]>([]);

  useEffect(() => {
    api.publishedPapers("hod").then(setPapers);
  }, []);

  return <div className="space-y-6">
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

    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-serif">Published Research Papers</CardTitle>
          <Button size="sm" className="gap-2" disabled={!API_BASE_URL} onClick={() => downloadReportPdf("/reports/hod/research-report.pdf")}>
            <Download className="h-4 w-4" /> PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paper</TableHead>
              <TableHead className="hidden sm:table-cell">Faculty</TableHead>
              <TableHead className="hidden md:table-cell">Journal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {papers.map((paper) => (
              <TableRow key={paper.id}>
                <TableCell className="font-medium">{paper.title}</TableCell>
                <TableCell className="hidden sm:table-cell">{paper.faculty}</TableCell>
                <TableCell className="hidden md:table-cell">{paper.journal} · {paper.year}</TableCell>
                <TableCell><Badge variant={paper.status === "Pending" ? "secondary" : "default"}>{paper.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => downloadResearchItem({
                    id: paper.id, title: paper.title, type: "paper", author: paper.faculty,
                    authorRole: "faculty", department: paper.department, venue: paper.journal,
                    year: paper.year, status: paper.status === "Published" ? "Approved" : paper.status,
                  })}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
};

export default HodReports;
