import { Link, useLocation } from "react-router-dom";
import {
  Home, Users, MessageCircle, Briefcase, Store, UserPlus, Newspaper,
  CalendarDays, Handshake, Star, Search, Camera, Video, Settings, Bell, Crown, PawPrint
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/alief-locals-logo.png";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: UserPlus, label: "Neighbors", path: "/people" },
  { icon: MessageCircle, label: "Messages", path: "/messages" },
  { icon: Users, label: "Groups", path: "/groups" },
  { icon: CalendarDays, label: "Local Events", path: "/community?tab=events" },
  { icon: Handshake, label: "Meetups", path: "/community?tab=meetups" },
  { icon: Newspaper, label: "Community Posts", path: "/community" },
  { icon: Crown, label: "Premium", path: "/community?tab=premium" },
  { icon: Store, label: "Local Businesses", path: "/businesses" },
  { icon: Star, label: "Reviews", path: "/businesses?tab=reviews" },
  { icon: Search, label: "Find Services", path: "/businesses?tab=services" },
  { icon: Briefcase, label: "Local Jobs", path: "/jobs" },
  { icon: Video, label: "Videos", path: "/community?tab=videos" },
  { icon: Camera, label: "Photos", path: "/community?tab=photos" },
  { icon: PawPrint, label: "Lost & Found", path: "/lost-found" },
  { icon: Settings, label: "Settings", path: "/community?tab=settings" },
  { icon: Bell, label: "Notifications", path: "/community?tab=notifications" },
];

const SocialSidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path.includes("?")) {
      return location.pathname + location.search === path;
    }
    return location.pathname === path;
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r bg-card p-4 gap-1 overflow-y-auto">
      <Link to="/" className="flex items-center gap-2 mb-4 px-2">
        <img src={logo} alt="Alief Locals" className="h-8" />
      </Link>

      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = isActive(path);
          return (
            <Link
              key={label}
              to={path}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="border-t pt-3 mt-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
              {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground truncate max-w-[150px]">
                {user.displayName || user.email?.split("@")[0]}
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
