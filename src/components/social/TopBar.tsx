import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, LogOut, Search, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import logo from "@/assets/alief-locals-logo.png";

const TopBar = () => {
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      {/* Desktop top bar - search + actions */}
      <header className="hidden lg:flex sticky top-0 z-50 bg-card border-b px-6 py-3 items-center gap-4">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search businesses, jobs, neighbors, events..."
              className="w-full pl-9 pr-4 py-2.5 rounded-full bg-muted/50 border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          {user ? (
            <>
              <button className="p-2 rounded-full hover:bg-muted text-muted-foreground relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
                Create
              </button>
              <button onClick={signOut} className="p-2 rounded-full hover:bg-muted text-muted-foreground" title="Sign out">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Alief Locals" className="h-7" />
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                <Search size={20} />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </button>
              <button onClick={signOut} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default TopBar;
