import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { API_BASE_URL, api, downloadReportPdf, downloadResearchItem, type PublishedPaper } from "@/lib/api";
import RejectedSubmissions from "@/components/RejectedSubmissions";

const MyReports = () => {
  const [papers, setPapers] = useState<PublishedPaper[]>([]);

  useEffect(() => {
    api.publishedPapers("faculty").then(setPapers);
  }, []);

  return <div className="space-y-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">My Reports</h1>
      <p className="text-muted-foreground mt-1">View your submission history and research impact scores.</p>
    </div>

    <RejectedSubmissions />

    <div className="grid sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-5 text-center">
          <BarChart3 className="h-6 w-6 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold font-serif text-foreground">Rank #12</div>
          <p className="text-xs text-muted-foreground">Department Ranking</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5 text-center">
          <div className="text-2xl font-bold font-serif text-foreground">85</div>
          <p className="text-xs text-muted-foreground">Average Score</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5 text-center">
          <div className="text-2xl font-bold font-serif text-foreground">14</div>
          <p className="text-xs text-muted-foreground">Total Publications</p>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base font-serif">Published Research Papers</CardTitle>
          <Button size="sm" className="gap-2" disabled={!API_BASE_URL} onClick={() => downloadReportPdf("/reports/faculty/research-report.pdf")}>
            <Download className="h-4 w-4" /> PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paper</TableHead>
              <TableHead className="hidden sm:table-cell">Journal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Score</TableHead>
              <TableHead className="text-right">Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {papers.map((paper) => (
              <TableRow key={paper.id}>
                <TableCell className="font-medium">{paper.title}</TableCell>
                <TableCell className="hidden sm:table-cell">{paper.journal} · {paper.year}</TableCell>
                <TableCell>
                  <Badge variant={paper.status === "Pending" ? "secondary" : "default"}>{paper.status}</Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell font-serif font-bold">{paper.score ?? "—"}</TableCell>
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
  </div>;
};

export default MyReports;
