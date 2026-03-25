import { Search } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/alief-hero.png";
import SocialMediaLinks from "@/components/SocialMediaLinks";

const HeroSection = () => {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Aerial view of Alief, Texas"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/70" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center px-4 sm:px-6 py-12 sm:py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-7xl font-serif font-semibold text-white leading-[1.1] mb-4 sm:mb-6"
        >
          Discover The Best Local{" "}
          <span className="text-primary">Businesses in Alief</span>{" "}
          and Surrounding Areas in Texas
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-6 sm:mb-10 leading-relaxed"
        >
          For those of us who appreciate our local, hardworking friends and families
          right here in the 77083.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-2xl mx-auto"
        >
          <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Find a mechanic, dentist, or church..."
            className="w-full pl-11 sm:pl-14 pr-4 sm:pr-8 py-3.5 sm:py-5 rounded-full bg-white shadow-elevated border text-foreground placeholder:text-muted-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mt-6 sm:mt-8"
        >
          <p className="text-white/60 text-xs sm:text-sm mb-3">Follow us on social media</p>
          <SocialMediaLinks variant="light" size="md" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
