import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import logo from "@/assets/alief-locals-logo.png";

const TopBar = () => {
  const { user, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="lg:hidden sticky top-0 z-50 bg-card border-b px-4 py-3 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <img src={logo} alt="Alief Locals" className="h-7" />
      </Link>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
              <Bell size={20} />
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

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </header>
  );
};

export default TopBar;
