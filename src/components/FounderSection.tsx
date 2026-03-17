import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, MapPin } from "lucide-react";
import founderPortrait from "@/assets/founder-portrait.webp";
import aliefCenter from "@/assets/alief-center.png";
import aliefFood from "@/assets/alief-food.png";
import aliefNature from "@/assets/alief-nature.png";
import aliefHeb from "@/assets/alief-heb.png";
import aliefShopping from "@/assets/alief-shopping.png";
import missionBendLibrary from "@/assets/mission-bend-library.png";

const images = [
  { src: aliefCenter, alt: "Alief Community Center", name: "Alief Community Center", address: "11903 Bellaire Blvd, Houston, TX 77072" },
  { src: aliefFood, alt: "Bellaire Food Street near Alief", name: "Bellaire Food Street", address: "Bellaire Blvd, Houston, TX 77072" },
  { src: aliefHeb, alt: "HEB grocery store in Alief", name: "H-E-B Alief", address: "Alief, TX 77083" },
  { src: aliefNature, alt: "Nature trail in Alief area", name: "Alief Nature Trail", address: "Alief, TX 77083" },
  { src: aliefShopping, alt: "Shopping and entertainment in Alief", name: "Alief Shopping Center", address: "Alief, TX 77083" },
  { src: missionBendLibrary, alt: "Mission Bend Branch Library", name: "Mission Bend Branch Library", address: "8421 Addicks-Clodine Rd, Houston, TX 77083" },
];

const scrollImages = [...images, ...images];

const FounderSection = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((scrollIndex: number) => {
    setLightboxIndex(scrollIndex % images.length);
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
  }, []);

  return (
    <section className="py-[15vh] bg-foreground overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        {/* How It Works — Founder Bio + Portrait */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start mb-16"
        >
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-white leading-tight mb-6">
              How It Works
            </h2>
            <p className="text-lg text-white/75 leading-relaxed mb-5">
              The best local businesses aren't always the ones with the biggest ad budgets.{" "}
              <strong className="text-white">Alief Locals</strong> is the place to discover the
              local gems in our community.
            </p>
            <p className="text-lg text-white/75 leading-relaxed mb-5">
              Our listings are <strong className="text-white">free, but invitation-only</strong>.
              This means you aren't seeing who paid the most to be here. You are seeing business
              owners who earned their spot because they are proud of what they do and are willing
              to stand behind their work.
            </p>
            <p className="text-lg text-white/75 leading-relaxed mb-5">
              Knowing the people behind a business matters. When you connect with a neighbor who
              puts their heart into their business, you get a higher level of accountability.
            </p>
            <p className="text-base text-white/55 leading-relaxed">
              We also like having fun. So, we regularly run{" "}
              <strong className="text-primary">giveaways, raffles, and scavenger hunts</strong>{" "}
              to help you discover the best local businesses in Alief &amp; the 77083 area.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-52 h-52 md:w-60 md:h-60 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg">
              <img
                src={founderPortrait}
                alt="Founder of Alief Locals"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-white/60 text-sm text-center max-w-[14rem] leading-snug">
              Pastor / Evangelist &amp; MBA — Founder of Alief Locals
            </p>
          </div>
        </motion.div>

        {/* Email + Calendly CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-xl"
        >
          <a
            href="https://calendly.com/thesthillstudios/sthill-studios-website-design-marketing-and-seo-meeting"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full text-center py-4 px-6 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
          >
            📅 Book a Free Meeting
          </a>
        </motion.div>

        {/* Welcome to Alief heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-white leading-tight mb-6">
            Welcome to{" "}
            <span className="text-primary">Alief, Texas</span>
          </h2>
          <p className="text-lg text-white/75 leading-relaxed mb-6">
            Alief is one of the most culturally diverse communities in the entire United States,
            located in southwest Houston within Harris County. Home to over 100,000 residents representing
            dozens of nationalities, Alief is a place where authentic cuisines, family-owned shops,
            and tight-knit neighborhoods come together.
          </p>
          <p className="text-lg text-white/75 leading-relaxed">
            From the famous Bellaire Food Street to the brand-new Alief Community Center,
            our neighborhood is thriving. Whether you need a trusted mechanic, a great barber,
            or a new church home — the best businesses in 77083 are right here, run by your neighbors.
          </p>
        </motion.div>
      </div>

      {/* Infinite auto-scrolling carousel */}
      <div className="relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-foreground to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-foreground to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-5 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: { repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" },
          }}
        >
          {scrollImages.map((img, i) => (
            <div
              key={`${img.alt}-${i}`}
              className="flex-shrink-0 w-[350px] md:w-[420px] rounded-2xl overflow-hidden cursor-pointer relative group"
              onClick={() => openLightbox(i)}
            >
              <div className="aspect-[16/10]">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10">
                <h3 className="text-white font-semibold text-lg leading-tight">{img.name}</h3>
                <p className="text-white/60 text-sm flex items-center gap-1 mt-1">
                  <MapPin size={12} /> {img.address}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-50"
              aria-label="Close lightbox"
            >
              <X size={36} />
            </button>

            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 text-center">
              <h3 className="text-white text-2xl md:text-3xl font-serif font-semibold">
                {images[lightboxIndex].name}
              </h3>
              <p className="text-white/50 text-sm flex items-center justify-center gap-1.5 mt-1">
                <MapPin size={14} /> {images[lightboxIndex].address}
              </p>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-50 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md flex items-center justify-center transition-all animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] border border-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft size={48} className="text-white md:w-14 md:h-14" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-50 w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md flex items-center justify-center transition-all animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] border border-white/20"
              aria-label="Next image"
            >
              <ChevronRight size={48} className="text-white md:w-14 md:h-14" />
            </button>

            <AnimatePresence mode="wait">
              <motion.img
                key={lightboxIndex}
                src={images[lightboxIndex].src}
                alt={images[lightboxIndex].alt}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-[75vw] max-h-[75vh] object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === lightboxIndex ? "bg-primary scale-125" : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>

            <p className="absolute bottom-6 right-8 text-white/50 text-sm font-mono">
              {lightboxIndex + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FounderSection;
