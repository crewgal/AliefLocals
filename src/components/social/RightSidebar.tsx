import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, ArrowRight, MapPin, Star, Briefcase, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import AuthModal from "@/components/AuthModal";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import SponsorAdBanner from "@/components/SponsorAdBanner";
import { listPeople, listBusinesses, type Profile, type Business } from "@/lib/api";

const RightSidebar = () => {
  const { user } = useAuth();
  const [people, setPeople] = useState<Profile[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [peopleData, bizData] = await Promise.all([
          listPeople(),
          listBusinesses(),
        ]);
        setPeople(peopleData.filter((p) => p.user_id !== user?.id));
        setBusinesses(bizData);
      } catch {}
    };
    fetchData();
  }, [user]);

  return (
    <aside className="hidden xl:block w-80 h-screen sticky top-0 p-4 space-y-4 overflow-y-auto">
      {/* People Nearby */}
      <div className="bg-card border rounded-xl p-4 shadow-card">
        <h3 className="text-sm font-serif font-semibold text-foreground mb-3">People Nearby</h3>
        <div className="grid grid-cols-2 gap-3">
          {people.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              {p.avatar_url ? (
                <img src={p.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-xs">
                  {(p.display_name?.[0] ?? "?").toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-foreground truncate max-w-[80px]">{p.display_name ?? "Neighbor"}</p>
                <span className="text-[10px] text-green-500">now</span>
              </div>
            </div>
          ))}
        </div>
        {people.length === 0 && (
          <p className="text-xs text-muted-foreground">No neighbors yet.</p>
        )}
        <Link to="/people" className="flex items-center gap-1 text-xs text-primary font-medium mt-3 hover:underline">
          Find Neighbors <ArrowRight size={12} />
        </Link>
      </div>

      {/* Upcoming Events */}
      <div className="bg-card border rounded-xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-serif font-semibold text-foreground">Upcoming Events Near You</h3>
          <Link to="/community?tab=events" className="text-xs text-primary hover:underline">See All</Link>
        </div>
        <div className="space-y-3">
          {[
            { name: "Farmer's Market", time: "Friday 9am", emoji: "🍎" },
            { name: "All About Church", time: "Saturday 10am", emoji: "⛪" },
            { name: "Neighborhood Garage Sale", time: "Sunday 8am", emoji: "🏠" },
          ].map((event) => (
            <div key={event.name} className="flex items-center gap-3">
              <span className="text-lg">{event.emoji}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{event.name}</p>
                <p className="text-xs text-muted-foreground">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
        <Link to="/businesses" className="flex items-center gap-1 text-xs text-primary font-medium mt-3 hover:underline">
          Find Businesses <ArrowRight size={12} />
        </Link>
      </div>

      {/* Top Local Businesses */}
      <div className="bg-card border rounded-xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-serif font-semibold text-foreground">Top Local Businesses</h3>
          <Link to="/businesses" className="text-xs text-primary hover:underline">See All</Link>
        </div>
        <div className="space-y-3">
          {businesses.slice(0, 4).map((biz) => (
            <Link key={biz.id} to={`/business/${biz.slug}`} className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                {biz.name[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{biz.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span>{biz.category}</span>
                  {biz.address && (
                    <>
                      <span>·</span>
                      <MapPin size={10} />
                      <span className="truncate">{biz.address.split(",")[0]}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
          {businesses.length === 0 && (
            <p className="text-xs text-muted-foreground">No businesses listed yet.</p>
          )}
        </div>
      </div>

      {/* Local Jobs */}
      <div className="bg-card border rounded-xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-serif font-semibold text-foreground">Local Jobs Hiring Now</h3>
          <Link to="/jobs" className="text-xs text-primary hover:underline">See All</Link>
        </div>
        <div className="space-y-2">
          {[
            { title: "Restaurant Server", pay: "$14/hr", type: "Part time" },
            { title: "Landscaper", pay: "$18/hr", type: "Full time" },
            { title: "Retail Associate", pay: "$13/hr", type: "Part time" },
          ].map((job) => (
            <Link key={job.title} to="/jobs" className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-primary" />
                <div>
                  <p className="text-xs font-medium text-foreground">{job.title}</p>
                  <p className="text-[10px] text-muted-foreground">{job.pay} · {job.type}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Community / Social */}
      <div className="bg-card border rounded-xl p-4 shadow-card">
        <h3 className="text-sm font-serif font-semibold text-foreground mb-2">Community</h3>
        <SocialMediaLinks variant="dark" size="sm" />
      </div>

      {/* Founding Sponsor Ad */}
      <SponsorAdBanner />

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </aside>
  );
};

export default RightSidebar;
