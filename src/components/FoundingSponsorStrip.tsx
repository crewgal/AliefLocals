import { Crown, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { foundingSponsors } from "@/components/FoundingSponsorsSection";

const FoundingSponsorStrip = () => {
  const filledSponsors = foundingSponsors.filter((s) => !s.name.startsWith("Founding Sponsor"));
  const openSlots = foundingSponsors.filter((s) => s.name.startsWith("Founding Sponsor"));

  return (
    <div className="rounded-xl border bg-[hsl(200,25%,10%)] p-4 sm:p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(45,80%,50%,0.06),transparent_60%)]" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Crown size={16} className="text-[hsl(45,80%,55%)]" />
            <h3 className="text-sm font-semibold text-white">Founding 10 Sponsors</h3>
          </div>
          <Link to="/founding-sponsors" className="text-[10px] sm:text-xs text-[hsl(45,80%,60%)] hover:underline font-medium">
            Learn More →
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {foundingSponsors.map((sponsor) => {
            const isFilled = !sponsor.name.startsWith("Founding Sponsor");
            return (
              <div
                key={sponsor.name}
                className={`flex-shrink-0 w-[100px] sm:w-[120px] rounded-lg p-2.5 text-center flex flex-col items-center ${
                  isFilled
                    ? "bg-white/5 border border-[hsl(45,80%,50%,0.2)]"
                    : "bg-white/[0.02] border border-dashed border-white/10"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-serif font-bold text-sm mb-1.5 ${
                    !isFilled ? "opacity-20" : ""
                  }`}
                  style={{ backgroundColor: sponsor.color }}
                >
                  {isFilled ? sponsor.initials : sponsor.initials}
                </div>
                <p className={`text-[10px] font-semibold leading-tight line-clamp-2 ${
                  isFilled ? "text-white" : "text-white/25"
                }`}>
                  {isFilled ? sponsor.name : "Open Spot"}
                </p>
                {isFilled && sponsor.website ? (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[hsl(45,80%,60%)] text-[9px] font-medium hover:underline mt-1 inline-flex items-center gap-0.5"
                  >
                    Visit <ExternalLink size={8} />
                  </a>
                ) : !isFilled ? (
                  <Link to="/get-listed" className="text-[hsl(45,80%,60%)] text-[9px] font-medium hover:underline mt-1">
                    Apply
                  </Link>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FoundingSponsorStrip;
