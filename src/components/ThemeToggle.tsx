import { Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark" || document.documentElement.classList.contains("dark");

  return (
    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(isDark ? "light" : "dark") }>
      <Moon className="h-4 w-4" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
