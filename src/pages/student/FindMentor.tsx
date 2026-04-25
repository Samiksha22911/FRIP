/**
 * Student → Find a Mentor.
 *
 * Helps a student decide which faculty member to approach for a research
 * topic. Given a free-text title/keywords, we score every faculty by the
 * relevance of their **approved** publications and rank the top mentors.
 *
 * Scoring is intentionally simple and dependency-free:
 *  - Tokenize the query and the publication's title + venue + citation.
 *  - +3 for every full token match in the title, +1 for venue/citation hits.
 *  - Results aggregate by faculty, then sort by total score desc.
 */
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye, Sparkles, GraduationCap } from "lucide-react";
import PublicationDetailsDialog from "@/components/PublicationDetailsDialog";
import { usePublications, type Publication } from "@/lib/publications";

const STOP = new Set([
  "a", "an", "the", "of", "and", "or", "in", "on", "for", "to", "with", "is",
  "are", "as", "by", "at", "from", "be", "this", "that", "using", "based",
]);

const tokenize = (s: string) =>
  s.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2 && !STOP.has(t));

interface MentorMatch {
  faculty: string;
  department: string;
  score: number;
  matched: Publication[];
}

const FindMentor = () => {
  const all = usePublications();
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<Publication | null>(null);

  const results = useMemo<MentorMatch[]>(() => {
    const tokens = tokenize(query);
    if (tokens.length === 0) return [];
    const approved = all.filter((p) => p.status === "Approved");
    const byFaculty = new Map<string, MentorMatch>();
    for (const p of approved) {
      const titleTokens = tokenize(p.paperTitle);
      const ctxTokens = tokenize(
        `${p.kind === "journal" ? p.journalName : p.kind === "conference" ? p.conferenceName : p.publisherName} ${p.citation}`
      );
      let score = 0;
      for (const t of tokens) {
        if (titleTokens.includes(t)) score += 3;
        else if (ctxTokens.includes(t)) score += 1;
      }
      if (score === 0) continue;
      const key = `${p.facultyName}__${p.department}`;
      const existing = byFaculty.get(key);
      if (existing) {
        existing.score += score;
        existing.matched.push(p);
      } else {
        byFaculty.set(key, {
          faculty: p.facultyName,
          department: p.department,
          score,
          matched: [p],
        });
      }
    }
    return Array.from(byFaculty.values()).sort((a, b) => b.score - a.score).slice(0, 8);
  }, [query, all]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" /> Find a Research Mentor
        </h1>
        <p className="text-muted-foreground mt-1">
          Type your research topic or paper title — we'll suggest faculty who publish in that area.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-serif">Search by topic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. federated learning at the edge, sustainable materials, IoT campus monitoring"
              className="pl-9 h-11"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tip: include 3–6 keywords from your topic for the best matches.
          </p>
        </CardContent>
      </Card>

      {query.trim() && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-serif">
              {results.length > 0
                ? `Top ${results.length} mentor${results.length > 1 ? "s" : ""} for your topic`
                : "No mentors matched — try different keywords."}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map((m, i) => (
              <div key={`${m.faculty}-${m.department}`} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif font-semibold text-foreground truncate">
                        #{i + 1} · {m.faculty}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {m.department} · {m.matched.length} matching publication{m.matched.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">Match score {m.score}</Badge>
                </div>
                <div className="space-y-1.5">
                  {m.matched.slice(0, 3).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setViewing(p)}
                      className="w-full text-left flex items-center justify-between gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm"
                    >
                      <span className="truncate">{p.paperTitle}</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                        {p.year} <Eye className="h-3 w-3 ml-1" />
                      </span>
                    </button>
                  ))}
                  {m.matched.length > 3 && (
                    <p className="text-xs text-muted-foreground px-3">+ {m.matched.length - 3} more</p>
                  )}
                </div>
                <Button size="sm" variant="outline" className="mt-3 gap-1" onClick={() => setViewing(m.matched[0])}>
                  <Eye className="h-3 w-3" /> View top publication
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <PublicationDetailsDialog
        publication={viewing}
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      />
    </div>
  );
};

export default FindMentor;
