import { useState } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";
import logo from "@/assets/alief-locals-logo.png";

const categories = [
  { name: "Restaurants", slug: "restaurants" },
  { name: "Mechanics", slug: "mechanics" },
  { name: "Dentists", slug: "dentists" },
  { name: "Car Insurance", slug: "car-insurance" },
  { name: "Barber Shops", slug: "barber-shops" },
  { name: "Churches", slug: "churches" },
  { name: "Car Dealerships", slug: "car-dealerships" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4 overflow-visible">
          <Link to="/">
            <img src={logo} alt="Alief Locals" className="h-24 -my-2" />
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link to="/community" className="px-3 py-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              Community
            </Link>
            <Link to="/jobs" className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Jobs
            </Link>
            <Link to="/business-dashboard" className="ml-2 px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
              Business Login
            </Link>

            {user ? (
              <div className="ml-2 flex items-center gap-2">
                <span className="text-sm text-muted-foreground truncate max-w-[120px]">
                  {user.displayName || user.email?.split("@")[0]}
                </span>
                <button
                  onClick={signOut}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuth(true)}
                className="ml-2 flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border rounded-full"
              >
                <User size={16} />
                Sign in
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden border-t bg-card px-6 pb-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link to="/jobs" className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
              Jobs
            </Link>
            <Link to="/business-dashboard" className="mt-2 block text-center w-full px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-full" onClick={() => setOpen(false)}>
              Business Login
            </Link>

            {user ? (
              <button
                onClick={() => { signOut(); setOpen(false); }}
                className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border rounded-full"
              >
                <LogOut size={16} />
                Sign out
              </button>
            ) : (
              <button
                onClick={() => { setShowAuth(true); setOpen(false); }}
                className="mt-2 flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border rounded-full"
              >
                <User size={16} />
                Sign in
              </button>
            )}
          </div>
        )}
      </nav>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Navbar;
