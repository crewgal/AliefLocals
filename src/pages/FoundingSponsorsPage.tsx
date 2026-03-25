import { motion } from "framer-motion";
import { Crown, ExternalLink, Star, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { foundingSponsors } from "@/components/FoundingSponsorsSection";

const perks = [
  "Permanent homepage recognition in the Founding 10 section",
  "Rotating banner ad across community & business dashboards",
  "Featured placement in the sponsored scroller",
  "Lifetime verified badge on your business profile",
  "Priority placement in search results — forever",
  "Social media shoutouts and newsletter features",
  "Direct link to your website from every ad placement",
];

const FoundingSponsorsPage = () => {
  const filledSponsors = foundingSponsors.filter((s) => !s.name.startsWith("Founding Sponsor"));
  const openSlots = 10 - filledSponsors.length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-[hsl(200,25%,10%)] py-12 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,hsl(45,80%,50%,0.08),transparent_50%)]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[hsl(45,80%,50%,0.15)] text-[hsl(45,80%,65%)] px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Crown size={16} /> Exclusive — Only 10 Spots
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
              The Founding 10
            </h1>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
              We're selecting <strong className="text-white">10 founding businesses</strong> to sponsor Alief Locals.
              In return, they receive <strong className="text-[hsl(45,80%,65%)]">lifetime promotion</strong> across
              every page of our platform — homepage, dashboards, social feeds, and more.
            </p>
            {openSlots > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/get-listed"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(45,80%,50%)] text-[hsl(200,25%,10%)] font-bold text-sm hover:bg-[hsl(45,80%,55%)] transition-colors"
                >
                  <Crown size={16} /> Apply to Be a Founder of Alief Locals
                </Link>
                <span className="text-[hsl(45,80%,60%)] text-sm font-semibold">
                  {openSlots} of 10 spots remaining
                </span>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* What Founders Get */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground mb-6 sm:mb-8 text-center">
            What Founding Sponsors Receive
          </h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {perks.map((perk, i) => (
              <motion.div
                key={perk}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 bg-card border rounded-xl p-4"
              >
                <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{perk}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Grid */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-foreground mb-8 text-center">
            Meet Our Founding Sponsors
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
            {foundingSponsors.map((sponsor, i) => {
              const isFilled = !sponsor.name.startsWith("Founding Sponsor");
              return (
                <motion.div
                  key={sponsor.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl p-5 text-center flex flex-col items-center border ${
                    isFilled
                      ? "bg-card border-primary/20 shadow-card"
                      : "bg-card/50 border-dashed border-muted-foreground/20"
                  }`}
                >
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center mb-3 text-white font-serif font-bold text-xl ${
                      !isFilled ? "opacity-20" : ""
                    }`}
                    style={{ backgroundColor: sponsor.color }}
                  >
                    {isFilled ? sponsor.initials : <Star size={24} />}
                  </div>
                  <h3 className={`text-sm font-semibold mb-1 ${isFilled ? "text-foreground" : "text-muted-foreground"}`}>
                    {sponsor.name}
                  </h3>
                  <p className={`text-xs leading-relaxed mb-3 ${isFilled ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                    {sponsor.description}
                  </p>
                  {isFilled && sponsor.website ? (
                    <a
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-xs font-semibold hover:underline"
                    >
                      Visit Website <ExternalLink size={11} />
                    </a>
                  ) : !isFilled ? (
                    <Link to="/get-listed" className="text-primary text-xs font-semibold hover:underline">
                      Claim This Spot →
                    </Link>
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FoundingSponsorsPage;
