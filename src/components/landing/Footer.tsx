import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* LOGO + NAME */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 overflow-hidden">
              <img
                src="/mits-logo.png"
                alt="MITS Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif text-lg font-bold text-foreground">
              FRI Portal
            </span>
          </div>

          {/* TAGLINE */}
          <p className="text-sm text-muted-foreground">
            Faculty Research Impact Portal — Digitizing academic excellence.
          </p>

          {/* LINKS */}
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#roles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Roles</a>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Login
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;