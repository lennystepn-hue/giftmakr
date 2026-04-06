import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Gift } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        location.pathname === to ? "text-sage" : "text-charcoal/60 hover:text-sage"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="border-b border-sage/10 bg-cream/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-sage">
            <Gift size={22} className="text-apricot" />
            Giftmakr
          </Link>
          <nav className="flex items-center gap-6">
            {navLink("/find", "Find a Gift")}
            {navLink("/about", "About")}
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-sage/10 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-heading font-bold text-sage">
              <Gift size={18} className="text-apricot" />
              Giftmakr
            </div>
            <div className="flex items-center gap-4 text-sm text-charcoal/50">
              <Link to="/about" className="hover:text-sage transition-colors">About</Link>
              <Link to="/privacy" className="hover:text-sage transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-sage transition-colors">Terms</Link>
              <a href="mailto:support@giftmakr.com" className="hover:text-sage transition-colors">Contact</a>
            </div>
            <p className="text-xs text-charcoal/40">&copy; {new Date().getFullYear()} Giftmakr</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
