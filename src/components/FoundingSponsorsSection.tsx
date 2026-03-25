import { motion } from "framer-motion";
import { Crown, ExternalLink, Star } from "lucide-react";
import { Link } from "react-router-dom";

export interface FoundingSponsor {
  name: string;
  description: string;
  initials: string;
  color: string;
  website?: string;
  slug?: string;
}

export const foundingSponsors: FoundingSponsor[] = [
  {
    name: "STHill Studios",
    description: "Web design, marketing, and SEO agency serving Alief and the Houston area for 18+ years.",
    initials: "SS",
    color: "hsl(210 65% 35%)",
    website: "https://sthillstudios.com",
    slug: "sthillstudios",
  },
  // Slots 2–10 are open for founding sponsors
  { name: "Founding Sponsor #2", description: "This spot is reserved for a founding sponsor. Lifetime promotion and recognition.", initials: "02", color: "hsl(30 70% 45%)" },
  { name: "Founding Sponsor #3", description: "This spot is reserved for a founding sponsor. Lifetime promotion and recognition.", initials: "03", color: "hsl(150 50% 40%)" },
  { name: "Founding Sponsor #4", description: "This spot is reserved for a founding sponsor. Lifetime promotion and recognition.", initials: "04", color: "hsl(340 55% 45%)" },
  { name: "Founding Sponsor #5", description: "This spot is reserved for a founding sponsor. Lifetime promotion and recognition.", initials: "05", color: "hsl(260 50% 45%)" },
  { name: "Founding Sponsor #6", description: "This spot is reserved for a founding sponsor. Lifetime promotion and recognition.", initials: "06", color: "hsl(190 55% 40%)" },
  { name: "Founding Sponsor #7", description: "This spot is reserved for a founding sponsor. Lifetime promotion and recognition.", initials: "07", color: "hsl(20 65% 50%)" },
  { name: "Founding Sponsor #8", description: "This spot is reserved for a founding sponsor. Lifetime promotion and recognition.", initials: "08", color: "hsl(120 40% 38%)" },
  { name: "Founding Sponsor #9", description: "This spot is reserved for a founding sponsor. Lifetime promotion and recognition.", initials: "09", color: "hsl(280 45% 42%)" },
  { name: "Founding Sponsor #10", description: "This spot is reserved for a founding sponsor. Lifetime promotion and recognition.", initials: "10", color: "hsl(45 70% 45%)" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const FoundingSponsorsSection = () => {
  const filledSponsors = foundingSponsors.filter((s) => !s.name.startsWith("Founding Sponsor"));
  const openSlots = 10 - filledSponsors.length;

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 bg-[hsl(200,25%,10%)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,hsl(45,80%,50%,0.06),transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-[hsl(45,80%,50%,0.15)] text-[hsl(45,80%,65%)] px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-3">
            <Crown size={14} /> Lifetime Partners
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-white mb-3">
            Our Founding 10 Sponsors
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm sm:text-base">
            These visionary businesses believed in Alief Locals from the very beginning.
            They receive <strong className="text-white/80">lifetime promotion</strong> across our platform.
          </p>
          {openSlots > 0 && (
            <p className="mt-3 text-[hsl(45,80%,60%)] text-sm font-semibold">
              {openSlots} of 10 spots remaining — 
              <Link to="/get-listed" className="underline hover:text-[hsl(45,80%,70%)]">
                Apply now
              </Link>
            </p>
          )}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={container}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
        >
          {foundingSponsors.map((sponsor) => {
            const isFilled = !sponsor.name.startsWith("Founding Sponsor");
            return (
              <motion.div
                key={sponsor.name}
                variants={item}
                className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center flex flex-col items-center border transition-all duration-300 ${
                  isFilled
                    ? "bg-white/5 border-[hsl(45,80%,50%,0.3)] hover:border-[hsl(45,80%,50%,0.6)] shadow-lg"
                    : "bg-white/[0.02] border-dashed border-white/10 hover:border-[hsl(45,80%,50%,0.3)]"
                }`}
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-3 text-white font-serif font-bold text-lg sm:text-xl ${
                    isFilled ? "" : "opacity-30"
                  }`}
                  style={{ backgroundColor: sponsor.color }}
                >
                  {isFilled ? sponsor.initials : <Star size={20} />}
                </div>
                <h3 className={`text-xs sm:text-sm font-semibold mb-1 line-clamp-2 ${
                  isFilled ? "text-white" : "text-white/30"
                }`}>
                  {sponsor.name}
                </h3>
                {isFilled ? (
                  <>
                    <p className="text-[10px] sm:text-xs text-white/50 leading-relaxed mb-2 line-clamp-2">
                      {sponsor.description}
                    </p>
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[hsl(45,80%,60%)] text-[10px] sm:text-xs font-semibold hover:underline"
                      >
                        Visit <ExternalLink size={10} />
                      </a>
                    )}
                  </>
                ) : (
                  <Link
                    to="/get-listed"
                    className="text-[hsl(45,80%,60%)] text-[10px] sm:text-xs font-semibold hover:underline"
                  >
                    Claim This Spot →
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <div className="text-center mt-8">
          <Link
            to="/founding-sponsors"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[hsl(45,80%,50%)] text-[hsl(200,25%,10%)] font-semibold text-sm hover:bg-[hsl(45,80%,55%)] transition-colors"
          >
            <Crown size={16} /> Learn More About Our Founding 10
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FoundingSponsorsSection;
