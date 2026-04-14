import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState<"admin" | "hod" | "faculty">("faculty");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder navigation — will need real auth later
    if (role === "admin") navigate("/admin");
    else if (role === "hod") navigate("/hod");
    else navigate("/faculty");
  };

  const roles = [
    { key: "admin" as const, label: "Admin" },
    { key: "hod" as const, label: "HOD" },
    { key: "faculty" as const, label: "Faculty" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 hero-gradient relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-primary/20" />
        <div className="relative text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-8 w-8 text-primary-foreground" />
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
              <Input id="email" type="email" placeholder="you@college.edu" className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="h-11" />
            </div>
            <Button type="submit" className="w-full h-11 gap-2">
              Sign In as {roles.find((r) => r.key === role)?.label} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
