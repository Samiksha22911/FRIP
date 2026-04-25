import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";

const Login = () => {
  const [role, setRole] = useState<"admin" | "hod" | "faculty" | "student">("faculty");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (API_BASE_URL) {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.get("email"), password: formData.get("password"), role }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");
        localStorage.setItem("fri-token", data.token);
        localStorage.setItem("fri-user", JSON.stringify(data.user));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Login failed");
        setLoading(false);
        return;
      }
      setLoading(false);
    } else {
      // Local-only fallback so the chosen role is reflected in the dashboard header.
      const email = String(formData.get("email") || `${role}@fri.edu`);
      localStorage.setItem(
        "fri-user",
        JSON.stringify({ email, name: email.split("@")[0] || `${role} user`, role })
      );
    }

    if (role === "admin") navigate("/admin");
    else if (role === "hod") navigate("/hod");
    else if (role === "student") navigate("/student");
    else navigate("/faculty");
  };

  const roles = [
    { key: "admin" as const, label: "Admin" },
    { key: "hod" as const, label: "HOD" },
    { key: "faculty" as const, label: "Faculty" },
    { key: "student" as const, label: "Student" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-primary/20" />
        <div className="relative text-center">
         <div className="w-16 h-16 mx-auto mb-6">
  <img
    src="/mits-logo.png"
    alt="MITS Logo"
    className="w-full h-full object-contain"
  />
</div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4 font-serif">FRI Portal</h2>
          <p className="text-primary-foreground/70 max-w-sm">
            Faculty Research Impact Portal — Track, measure, and celebrate academic research contributions.
          </p>
        </div>
      </div>

      {/* Login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            ← Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-foreground font-serif mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to your account to continue.</p>

          {/* Role selector */}
          <div className="flex rounded-lg bg-muted p-1 mb-8">
            {roles.map((r) => (
              <button
                key={r.key}
                onClick={() => setRole(r.key)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  role === r.key
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@college.edu" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" className="h-11" />
            </div>
            <Button type="submit" className="w-full h-11 gap-2" disabled={loading}>
              {loading ? "Signing in..." : `Sign In as ${roles.find((r) => r.key === role)?.label}`} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
