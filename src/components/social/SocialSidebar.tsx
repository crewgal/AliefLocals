import { Link, useLocation } from "react-router-dom";
import { Home, Users, MessageCircle, Briefcase, Store, UserPlus, Newspaper } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/alief-locals-logo.png";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Users, label: "Feed", path: "/community" },
  { icon: Users, label: "Groups", path: "/groups" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: UserPlus, label: "Find Neighbors", path: "/people" },
  { icon: Store, label: "Businesses", path: "/businesses" },
  { icon: Briefcase, label: "Jobs", path: "/jobs" },
];

const SocialSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r bg-card p-4 gap-1">
      <Link to="/" className="flex items-center gap-2 mb-6 px-2">
        <img src={logo} alt="Alief Locals" className="h-8" />
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="border-t pt-3 mt-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
              {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground truncate max-w-[150px]">
                {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </p>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SocialSidebar;
