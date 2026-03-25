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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between py-2 sm:py-4 overflow-visible">
          <Link to="/">
            <img src={logo} alt="Alief Locals" className="h-14 sm:h-24 -my-1 sm:-my-2" />
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
            <div className="ml-2 flex items-center border border-primary rounded-full overflow-hidden">
              <Link to="/business-signup" className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 transition-colors">
                Business Signup
              </Link>
              <Link to="/business-dashboard" className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                Business Login
              </Link>
            </div>

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
              <Link
                to="/customer-dashboard"
                className="ml-2 flex flex-col items-center justify-center px-6 py-2 text-sm font-semibold text-primary bg-primary/10 border border-primary/30 rounded-full hover:bg-primary/20 transition-colors"
              >
                <span className="flex items-center gap-1.5"><User size={16} /> Locals</span>
                <span>Sign In</span>
              </Link>
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
          <div className="md:hidden border-t bg-card px-4 pb-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-1 py-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="py-2 px-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg"
                  onClick={() => setOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            <div className="border-t pt-2 space-y-2">
              <Link to="/community" className="block py-2 px-3 text-sm font-semibold text-primary" onClick={() => setOpen(false)}>
                Community
              </Link>
              <Link to="/jobs" className="block py-2 px-3 text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
                Jobs
              </Link>
              <Link to="/disaster-relief" className="block py-2 px-3 text-sm font-medium text-destructive hover:text-destructive/80" onClick={() => setOpen(false)}>
                🚨 Disaster Relief
              </Link>
            </div>
            <div className="border-t pt-3 space-y-2">
              <Link to="/business-signup" className="block text-center w-full px-5 py-2.5 text-sm font-medium text-primary border border-primary rounded-full" onClick={() => setOpen(false)}>
                Business Signup
              </Link>
              <Link to="/business-dashboard" className="block text-center w-full px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-full" onClick={() => setOpen(false)}>
                Business Login
              </Link>

              {user ? (
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border rounded-full"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              ) : (
                <Link
                  to="/customer-dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground border rounded-full"
                >
                  <User size={16} />
                  Local Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Navbar;
