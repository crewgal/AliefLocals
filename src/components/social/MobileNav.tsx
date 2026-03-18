import { Link, useLocation } from "react-router-dom";
import { Home, Users, MessageCircle, UserPlus, Store } from "lucide-react";

const items = [
  { icon: Home, label: "Feed", path: "/community" },
  { icon: Users, label: "Groups", path: "/groups" },
  { icon: MessageCircle, label: "Chat", path: "/messages" },
  { icon: UserPlus, label: "People", path: "/people" },
  { icon: Store, label: "Biz", path: "/businesses" },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-50 flex justify-around py-2 px-1">
      {items.map(({ icon: Icon, label, path }) => {
        const active = location.pathname === path;
        return (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium transition-colors ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MobileNav;
