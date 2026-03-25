import { useState, useEffect } from "react";
import { Crown, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { foundingSponsors } from "@/components/FoundingSponsorsSection";

const SponsorRotator = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % foundingSponsors.length);
        setFade(true);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sponsor = foundingSponsors[index];
  const isFilled = !sponsor.name.startsWith("Founding Sponsor");

  return (
    <div className="rounded-xl border bg-card p-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Crown size={12} className="text-primary" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
          Founding 10 Sponsors
        </span>
      </div>

      <div
        className={`flex items-center gap-3 transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-serif font-bold text-sm shrink-0"
          style={{ backgroundColor: sponsor.color }}
        >
          {sponsor.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            {isFilled ? sponsor.name : "Open Spot"}
          </p>
          {isFilled && sponsor.website ? (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-primary font-medium hover:underline inline-flex items-center gap-0.5"
            >
              Visit <ExternalLink size={8} />
            </a>
          ) : !isFilled ? (
            <Link
              to="/get-listed"
              className="text-[10px] text-primary font-medium hover:underline"
            >
              Be a Founder →
            </Link>
          ) : null}
        </div>
      </div>

      <div className="flex justify-center gap-1 mt-2">
        {foundingSponsors.map((_, i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full transition-colors ${
              i === index ? "bg-primary" : "bg-muted-foreground/20"
            }`}
          />
        ))}
      </div>

      <Link
        to="/founding-sponsors"
        className="block text-center text-[10px] text-muted-foreground hover:text-foreground mt-2"
      >
        Learn More →
      </Link>
    </div>
  );
};

export default SponsorRotator;
