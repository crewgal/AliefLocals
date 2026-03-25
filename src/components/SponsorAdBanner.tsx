import { Crown, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { foundingSponsors } from "@/components/FoundingSponsorsSection";

const SponsorAdBanner = () => {
  const filledSponsors = foundingSponsors.filter((s) => !s.name.startsWith("Founding Sponsor"));
  
  if (filledSponsors.length === 0) return null;

  // Rotate through filled sponsors based on time
  const sponsorIndex = Math.floor(Date.now() / 30000) % filledSponsors.length;
  const sponsor = filledSponsors[sponsorIndex];

  return (
    <div className="rounded-xl border bg-card p-4 shadow-card">
      <div className="flex items-center gap-1.5 text-[hsl(45,80%,50%)] text-[10px] font-semibold mb-3">
        <Crown size={12} /> FOUNDING SPONSOR
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-serif font-bold text-sm shrink-0"
          style={{ backgroundColor: sponsor.color }}
        >
          {sponsor.initials}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">{sponsor.name}</h4>
          <p className="text-[10px] text-muted-foreground line-clamp-1">{sponsor.description}</p>
        </div>
      </div>
      {sponsor.website && (
        <a
          href={sponsor.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
        >
          Visit Website <ExternalLink size={10} />
        </a>
      )}
      <div className="mt-2 pt-2 border-t">
        <Link to="/founding-sponsors" className="text-[10px] text-muted-foreground hover:text-foreground">
          Learn about our Founding 10 →
        </Link>
      </div>
    </div>
  );
};

export default SponsorAdBanner;
