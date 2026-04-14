import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 flex items-center justify-center">
            <img src="/college-logo.png" alt="College Logo" className="h-full w-full objects-contain"/>
          </div>
            <span className="font-serif text-lg font-bold text-foreground">FRI Portal</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Faculty Research Impact Portal — Digitizing academic excellence.
          </p>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roles</a>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
