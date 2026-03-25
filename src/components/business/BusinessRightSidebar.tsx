import { ArrowRight, Star, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SponsorAdBanner from "@/components/SponsorAdBanner";

const BusinessRightSidebar = () => {
  return (
    <aside className="hidden xl:flex flex-col w-72 h-screen sticky top-0 p-4 space-y-4 overflow-y-auto shrink-0">
      {/* Tips */}
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
          <Sparkles size={16} className="text-amber-500" /> Tips
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Want to grow faster? Upgrade to premium for more leads and visibility.
        </p>
        <button className="w-full py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">
          Upgrade Premium
        </button>
      </div>

      {/* Recent Messages */}
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Recent Messages</h3>
          <span className="text-muted-foreground">•••</span>
        </div>
        <div className="space-y-3">
          {[
            { name: "Sarah L.", time: "7 min", msg: "My AC is broken, can you come this afternoon?" },
            { name: "Mark Taylor", time: "2 hrs", msg: "Thank you for the great service! How can I leave a review?" },
            { name: "Lynda G.", time: "6 hrs", msg: "Hi, do you do free estimates for roof repairs?" },
          ].map((m) => (
            <div key={m.name} className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground shrink-0">
                {m.name[0]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-foreground">{m.name}</p>
                  <span className="text-[10px] text-muted-foreground">{m.time}</span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{m.msg}</p>
              </div>
            </div>
          ))}
        </div>
        <Link to="/messages" className="flex items-center gap-1 text-xs text-primary font-medium mt-3 hover:underline">
          Request Review <ArrowRight size={12} />
        </Link>
      </div>

      {/* Reviews & Ratings */}
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Reviews & Ratings</h3>
          <Link to="/business-dashboard?tab=reviews" className="text-xs text-primary hover:underline">See All</Link>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
            <span className="text-lg font-bold text-primary">4.8</span>
          </div>
          <div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
              ))}
              <Star size={12} className="text-amber-400" />
            </div>
            <p className="text-xs text-muted-foreground">174 Reviews</p>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { text: "Fast service and friendly staff", author: "John D." },
            { text: "Affordable and reliable. Will call again!", author: "Valerie M." },
            { text: "Quick work!", author: "Jee K." },
          ].map((r) => (
            <div key={r.author} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-foreground shrink-0">
                {r.author[0]}
              </div>
              <div>
                <p className="text-[11px] text-foreground">{r.text}</p>
                <p className="text-[10px] text-muted-foreground">— {r.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default BusinessRightSidebar;
