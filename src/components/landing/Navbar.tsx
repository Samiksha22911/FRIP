import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2">
          
          {/* MITS LOGO */}
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <img 
              src="/mits-logo.png" 
              alt="MITS Logo"
              className="w-full h-full object-cover hover:scale-105 transition"
            />
          </div>

          <span className="font-serif text-xl font-bold text-foreground">
            FRI Portal
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">User Roles</a>
          <ThemeToggle />
          <Link to="/login">
            <Button variant="default" size="sm">Sign In</Button>
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <Link to="/login">
            <Button variant="default" size="sm">Sign In</Button>
          </Link>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
