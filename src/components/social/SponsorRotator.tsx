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
    <div className="rounded-xl border-2 border-primary/20 bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Crown size={14} className="text-primary" />
          <span className="text-xs font-bold text-foreground uppercase tracking-wide">
            Founding 10
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {index + 1} / {foundingSponsors.length}
        </span>
      </div>

      <div
        className={`flex flex-col items-center text-center gap-2 py-3 transition-opacity duration-300 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-serif font-bold text-lg shadow-md"
          style={{ backgroundColor: sponsor.color }}
        >
          {sponsor.initials}
        </div>
        <p className="text-sm font-bold text-foreground">
          {isFilled ? sponsor.name : "Open Spot"}
        </p>
        <p className="text-[11px] text-muted-foreground leading-snug px-2 line-clamp-2">
          {sponsor.description}
        </p>
        {isFilled && sponsor.website ? (
          <a
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1 mt-1"
          >
            Visit <ExternalLink size={10} />
          </a>
        ) : !isFilled ? (
          <Link
            to="/get-listed"
            className="text-xs text-primary font-semibold hover:underline mt-1"
          >
            Be a Founder →
          </Link>
        ) : null}
      </div>

      <div className="flex justify-center gap-1 mt-2 mb-3">
        {foundingSponsors.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i === index ? "bg-primary" : "bg-muted-foreground/20"
            }`}
          />
        ))}
      </div>

      <Link
        to="/founding-sponsors"
        className="block w-full text-center text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg py-2 transition-colors"
      >
        View Our Founders
      </Link>
    </div>
  );
};

export default SponsorRotator;
