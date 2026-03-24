import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  MessageSquare,
  Phone,
  Star,
  Tag,
  Megaphone,
  Handshake,
  ClipboardList,
  Briefcase,
  Video,
  FileText,
  Building2,
  Settings,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

const mainNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/business-dashboard", active: true },
  { label: "Customer Leads", icon: UserPlus, href: "/business-dashboard?tab=leads", highlight: true },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Call Requests", icon: Phone, href: "/business-dashboard?tab=calls" },
  { label: "Reviews", icon: Star, href: "/business-dashboard?tab=reviews" },
  { label: "Promotions", icon: Tag, href: "/business-dashboard?tab=promos" },
];

const moreNav = [
  { label: "Partner Businesses", icon: Handshake, href: "/businesses" },
  { label: "Service Requests", icon: ClipboardList, href: "/business-dashboard?tab=requests" },
  { label: "Post a Job", icon: Briefcase, href: "/post-job" },
  { label: "Videos", icon: Video, href: "/business-dashboard?tab=videos" },
  { label: "Posts", icon: FileText, href: "/community" },
];

const businessNav = [
  { label: "Business Profile", icon: Building2, href: "/businesses" },
  { label: "Settings", icon: Settings, href: "/business-dashboard?tab=settings" },
  { label: "Billing", icon: CreditCard, href: "/business-dashboard?tab=billing" },
];

const BusinessSidebar = () => {
  const location = useLocation();
  const [advertiseOpen, setAdvertiseOpen] = useState(false);

  return (
    <aside className="hidden lg:flex flex-col w-56 h-screen sticky top-0 border-r bg-card py-4 px-3 overflow-y-auto shrink-0">
      <nav className="space-y-0.5">
        {mainNav.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.highlight
                  ? "text-primary font-semibold"
                  : isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}

        {/* Advertise dropdown */}
        <button
          onClick={() => setAdvertiseOpen(!advertiseOpen)}
          className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <span className="flex items-center gap-3">
            <Megaphone size={18} />
            Advertise
          </span>
          <ChevronDown size={14} className={`transition-transform ${advertiseOpen ? "rotate-180" : ""}`} />
        </button>
        {advertiseOpen && (
          <div className="pl-4 space-y-0.5">
            {moreNav.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <div className="mt-6 pt-4 border-t space-y-0.5">
        <p className="px-3 text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-semibold">Business</p>
        {businessNav.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
          >
            <item.icon size={16} />
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default BusinessSidebar;
