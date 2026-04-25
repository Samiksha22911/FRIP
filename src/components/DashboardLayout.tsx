import { ReactNode, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import {LogOut, Menu, X, Bell, User, Mail, Building2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const MitsLogo = () => (
  <img 
    src="/mits-logo.png" 
    alt="MITS Logo" 
    className="h-7 w-auto object-contain"
  />
);

interface DashboardLayoutProps {
  children: ReactNode;
  role: "admin" | "hod" | "faculty" | "student";
  navItems: { title: string; url: string; icon: React.ElementType }[];
}

const roleLabels = { admin: "Admin", hod: "HOD", faculty: "Faculty", student: "Student" };

const roleNotifications: Record<string, string[]> = {
  hod: [
    "3 faculty submissions are waiting for approval.",
    "Admin shared the monthly research review update.",
    "Department report is ready to download.",
  ],
  faculty: [
    "New research form assigned: Research Paper 2024.",
    "Your conference attendance submission was approved.",
    "Deadline reminder: pending form due in 3 days.",
  ],
  student: [
    "New publications added to the library this week.",
    "Find a mentor from approved faculty research.",
  ],
};

type StoredUser = {
  name?: string;
  email?: string;
  institute?: string;
  institution?: string;
  department?: string;
};

const DashboardLayout = ({ children, role, navItems }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const storedUser: StoredUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("fri-user") || "{}");
    } catch {
      return {};
    }
  })();

  const profile = {
    name: storedUser.name || `${roleLabels[role]} User`,
    email: storedUser.email || `${role}@fri.edu`,
    institute: storedUser.institute || storedUser.institution || "Faculty Research Institute",
    department:
      storedUser.department ||
      (role === "admin" ? "Administration" : role === "hod" ? "Department Office" : "Faculty Department"),
  };

  const notifications = role === "admin" ? [] : roleNotifications[role] || [];

  const handleSignOut = () => {
    localStorage.removeItem("fri-token");
    localStorage.removeItem("fri-user");
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  const currentPageTitle = navItems.find(
    (item) => location.pathname === item.url || location.pathname.startsWith(item.url + "/")
  )?.title || "Dashboard";

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex-shrink-0">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2.5">
              <MitsLogo />
            <div>
              <div className="font-serif font-bold text-sm">FRI Portal</div>
              <div className="text-xs text-sidebar-foreground/50">{roleLabels[role]} Panel</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 h-10">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-sidebar text-sidebar-foreground flex flex-col">
            <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                 <MitsLogo />   
                <div className="font-serif font-bold text-sm">FRI Portal</div>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1 rounded hover:bg-sidebar-accent">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-0.5">
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-sidebar-border">
              <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 border-b border-border bg-card text-card-foreground flex items-center justify-between gap-3 px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-1.5 rounded-lg hover:bg-muted"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
            <h2 className="font-serif font-semibold text-foreground text-lg truncate">{currentPageTitle}</h2>
          </div>
          <div className="hidden md:block flex-1 max-w-md">
            <GlobalSearch navItems={navItems} />
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {role !== "admin" && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 rounded-lg hover:bg-muted relative" aria-label="Open notifications">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 p-0">
                  <div className="border-b border-border px-4 py-3">
                    <p className="font-serif font-semibold text-sm text-foreground">Notifications</p>
                  </div>
                  <div className="p-2 space-y-1">
                    {notifications.map((notification) => (
                      <div key={notification} className="rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted">
                        {notification}
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <button className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary hover:bg-primary/15" aria-label="Open profile">
                  {roleLabels[role][0]}
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <div className="flex items-center gap-3 border-b border-border pb-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {roleLabels[role][0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif font-semibold text-foreground truncate">{profile.name}</p>
                    <p className="text-xs text-muted-foreground">{roleLabels[role]} Profile</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-foreground">{profile.name}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-foreground break-all">{profile.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div className="text-foreground">
                      <p>{profile.institute}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{profile.department}</p>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

interface GlobalSearchProps {
  navItems: { title: string; url: string; icon: React.ElementType }[];
}

const GlobalSearch = ({ navItems }: GlobalSearchProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return navItems.filter((item) => item.title.toLowerCase().includes(q)).slice(0, 6);
  }, [query, navItems]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search pages, faculty, papers..."
        className="pl-8 h-9 bg-muted/40"
      />
      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-11 z-40 rounded-md border border-border bg-popover shadow-md p-1">
          {results.map((r) => (
            <button
              key={r.url}
              onMouseDown={() => { navigate(r.url); setQuery(""); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-foreground hover:bg-muted text-left"
            >
              <r.icon className="h-4 w-4 text-muted-foreground" />
              {r.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
