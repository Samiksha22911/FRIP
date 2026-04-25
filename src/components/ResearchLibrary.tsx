import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, BookOpen, FileText, Mic, BookMarked } from "lucide-react";
import { api, downloadResearchItem, type ResearchItem, type ResearchItemType } from "@/lib/api";

const typeLabel: Record<ResearchItemType, string> = {
  paper: "Research Paper",
  book: "Book",
  chapter: "Book Chapter",
  conference: "Conference Paper",
};

const typeIcon: Record<ResearchItemType, React.ElementType> = {
  paper: FileText,
  book: BookOpen,
  chapter: BookMarked,
  conference: Mic,
};

interface ResearchLibraryProps {
  scope?: "all" | "hod" | "mine";
  title?: string;
  description?: string;
  filter?: (item: ResearchItem) => boolean;
}

const ResearchLibrary = ({ scope = "all", title = "Research Library", description = "All books, chapters, conference and research papers.", filter }: ResearchLibraryProps) => {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<ResearchItemType | "all">("all");

  useEffect(() => {
    api.researchItems(scope).then((data) => setItems(filter ? data.filter(filter) : data));
  }, [scope, filter]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter((i) => {
      if (activeType !== "all" && i.type !== activeType) return false;
      if (!q) return true;
      return [i.title, i.author, i.department, i.venue].some((v) => v.toLowerCase().includes(q));
    });
  }, [items, query, activeType]);

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: items.length, paper: 0, book: 0, chapter: 0, conference: 0 };
    items.forEach((i) => (base[i.type] = (base[i.type] || 0) + 1));
    return base;
  }, [items]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(["paper", "book", "chapter", "conference"] as ResearchItemType[]).map((t) => {
          const Icon = typeIcon[t];
          return (
            <Card key={t}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-lg font-bold font-serif">{counts[t] ?? 0}</div>
                  <div className="text-xs text-muted-foreground">{typeLabel[t]}s</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base font-serif">All Items</CardTitle>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search title, author, venue..." className="pl-8 w-72" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["all", "paper", "book", "chapter", "conference"] as const).map((t) => (
              <Button key={t} size="sm" variant={activeType === t ? "default" : "outline"} className="h-7 text-xs" onClick={() => setActiveType(t)}>
                {t === "all" ? `All (${counts.all})` : `${typeLabel[t]}s (${counts[t] ?? 0})`}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="hidden sm:table-cell">Type</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden lg:table-cell">Venue · Year</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="text-xs">{typeLabel[item.type]}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {item.author}
                    {item.authorRole === "hod" && <Badge variant="outline" className="ml-2 text-[10px]">HOD</Badge>}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{item.venue} · {item.year}</TableCell>
                  <TableCell>
                    <Badge variant={item.status === "Approved" ? "default" : item.status === "Rejected" ? "destructive" : "secondary"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="Download" onClick={() => downloadResearchItem(item)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-8">No items found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchLibrary;
