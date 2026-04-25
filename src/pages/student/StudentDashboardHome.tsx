/**
 * Student → Dashboard home.
 *
 * Quick stats and links into Browse / Find Mentor pages.
 */
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, Sparkles, Users, FileText } from "lucide-react";
import { useMemo } from "react";
import { usePublications } from "@/lib/publications";

const StudentDashboardHome = () => {
  const all = usePublications();
  const approved = useMemo(() => all.filter((p) => p.status === "Approved"), [all]);
  const facultyCount = useMemo(
    () => new Set(approved.map((p) => p.facultyName)).size,
    [approved]
  );
  const departmentCount = useMemo(
    () => new Set(approved.map((p) => p.department)).size,
    [approved]
  );

  const stats = [
    { label: "Approved publications", value: approved.length, icon: FileText },
    { label: "Faculty researchers", value: facultyCount, icon: Users },
    { label: "Departments", value: departmentCount, icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-serif text-foreground">Welcome, Student</h1>
        <p className="text-muted-foreground mt-1">
          Explore institute-wide research and find the right mentor for your project.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-serif">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/student/browse" className="block group">
          <Card className="h-full hover:border-primary transition-colors">
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-serif font-semibold text-lg mb-1">Browse all publications</h3>
              <p className="text-sm text-muted-foreground">
                Filter by type (journal, conference, book / chapter) and search the full library.
              </p>
              <p className="text-sm text-primary mt-3 font-medium group-hover:underline">Open browser →</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/student/find-mentor" className="block group">
          <Card className="h-full hover:border-primary transition-colors">
            <CardContent className="p-6">
              <Sparkles className="h-8 w-8 text-accent mb-3" />
              <h3 className="font-serif font-semibold text-lg mb-1">Find a research mentor</h3>
              <p className="text-sm text-muted-foreground">
                Type a topic or paper title — we'll rank faculty who publish in that area.
              </p>
              <p className="text-sm text-primary mt-3 font-medium group-hover:underline">Find mentor →</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboardHome;
