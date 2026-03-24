import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ExternalLink, Star, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import sthillAd from "@/assets/ads/sthillstudios-ad.png";

interface FeaturedSlide {
  type: "image-ad" | "business" | "cta";
  name: string;
  description?: string;
  initials?: string;
  color?: string;
  slug: string;
  tier?: "gold" | "silver" | "bronze";
  image?: string;
  link?: string;
}

const featuredSlides: FeaturedSlide[] = [
  {
    type: "image-ad",
    name: "STHill Studios",
    slug: "sthillstudios",
    image: sthillAd,
    link: "/get-listed",
  },
  {
    type: "business",
    name: "Trojan Grill",
    description: "American Cuisine — burgers, sandwiches, salads, and live music every month.",
    initials: "TG",
    color: "hsl(30 80% 50%)",
    slug: "trojan-grill",
    tier: "gold",
  },
  {
    type: "business",
    name: "Beth Baldwin Real Estate",
    description: "Exceptional service and effective marketing for your home buying journey.",
    initials: "BB",
    color: "hsl(210 30% 30%)",
    slug: "beth-baldwin-real-estate",
    tier: "gold",
  },
  {
    type: "cta",
    name: "Your Business Here",
    slug: "get-listed",
    link: "/get-listed",
  },
  {
    type: "business",
    name: "Sirius and the Wren",
    description: "Heart-centered Reiki healing for people and animals, promoting natural energy flow.",
    initials: "SW",
    color: "hsl(210 50% 40%)",
    slug: "sirius-and-the-wren",
    tier: "silver",
  },
  {
    type: "business",
    name: "Infinity Coordinator",
    description: "Expert event decorator creating affordable weddings and celebrations with creativity.",
    initials: "IC",
    color: "hsl(340 60% 50%)",
    slug: "infinity-coordinator",
    tier: "silver",
  },
  {
    type: "business",
    name: "Pigeon & Co",
    description: "Unique shopping with refurbished, new, artistic, and vintage finds.",
    initials: "PC",
    color: "hsl(150 40% 40%)",
    slug: "pigeon-co",
    tier: "bronze",
  },
  {
    type: "business",
    name: "Cindy Steele Real Estate",
    description: "Top-producing agent helping hundreds live the American dream.",
    initials: "CS",
    color: "hsl(280 50% 45%)",
    slug: "cindy-steele-real-estate",
    tier: "bronze",
  },
];

const tierBadge: Record<string, { label: string; className: string }> = {
  gold: { label: "⭐ Gold", className: "bg-yellow-400/20 text-yellow-300" },
  silver: { label: "Silver", className: "bg-white/10 text-white/70" },
  bronze: { label: "Bronze", className: "bg-orange-400/20 text-orange-300" },
};

const FeaturedScroller = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-12 px-6 bg-[hsl(200,25%,12%)] relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(30,80%,50%,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(200,60%,40%,0.06),transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="inline-flex items-center gap-2 bg-[hsl(30,80%,50%,0.15)] text-[hsl(30,80%,65%)] px-4 py-1.5 rounded-full text-sm font-semibold mb-3">
              <Star size={14} /> Sponsored
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-white">
              Featured Businesses
            </h2>
          </div>
          <Link
            to="/get-listed"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[hsl(30,80%,50%)] text-white font-semibold text-sm hover:bg-[hsl(30,80%,45%)] transition-colors"
          >
            Advertise Here →
          </Link>
        </motion.div>

        <div className="relative">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[hsl(43,80%,50%)]/20 backdrop-blur-sm border-2 border-[hsl(43,80%,55%)] flex items-center justify-center hover:bg-[hsl(43,80%,50%)]/40 transition-colors disabled:opacity-30 text-[hsl(43,80%,55%)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_15px_hsl(43,80%,50%,0.3)]"
            disabled={!canScrollPrev}
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[hsl(43,80%,50%)]/20 backdrop-blur-sm border-2 border-[hsl(43,80%,55%)] flex items-center justify-center hover:bg-[hsl(43,80%,50%)]/40 transition-colors disabled:opacity-30 text-[hsl(43,80%,55%)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_15px_hsl(43,80%,50%,0.3)]"
            disabled={!canScrollNext}
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-4">
              {featuredSlides.map((slide) => (
                <div
                  key={slide.name}
                  className="flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 pl-4"
                >
                  {slide.type === "image-ad" ? (
                    <Link to={slide.link || "/get-listed"} className="block h-full">
                      <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full border border-white/10">
                        <img
                          src={slide.image}
                          alt={slide.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                  ) : slide.type === "cta" ? (
                    <Link to="/get-listed" className="block h-full">
                      <div className="rounded-2xl border-2 border-dashed border-[hsl(30,80%,50%,0.5)] bg-[hsl(30,80%,50%,0.08)] p-6 h-full flex flex-col items-center justify-center text-center hover:bg-[hsl(30,80%,50%,0.15)] transition-colors duration-300 min-h-[280px]">
                        <div className="w-16 h-16 rounded-full bg-[hsl(30,80%,50%,0.2)] flex items-center justify-center mb-4">
                          <Plus size={28} className="text-[hsl(30,80%,65%)]" />
                        </div>
                        <h3 className="text-lg font-serif font-bold text-white mb-2">
                          Your Business
                        </h3>
                        <h3 className="text-lg font-serif font-bold text-[hsl(30,80%,60%)] mb-3">
                          Can Be Here!
                        </h3>
                        <p className="text-white/50 text-xs mb-4">
                          Starting at just $25/mo
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-[hsl(30,80%,60%)] text-sm font-semibold">
                          Get Featured <ExternalLink size={13} />
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="bg-[hsl(200,20%,16%)] border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full flex flex-col items-center text-center">
                      <div className="flex items-center gap-2 mb-4 w-full justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${tierBadge[slide.tier!].className}`}>
                          {tierBadge[slide.tier!].label}
                        </span>
                        <span className="text-[10px] text-white/40">Sponsored</span>
                      </div>

                      <div
                        className="w-20 h-20 rounded-xl flex items-center justify-center mb-4 text-white text-xl font-serif font-bold shadow-md"
                        style={{ backgroundColor: slide.color }}
                      >
                        {slide.initials}
                      </div>

                      <h3 className="text-base font-serif font-semibold text-white mb-2">
                        {slide.name}
                      </h3>
                      <p className="text-xs text-white/50 leading-relaxed mb-4 line-clamp-3">
                        {slide.description}
                      </p>

                      <Link
                        to={`/business/${slide.slug}`}
                        className="mt-auto text-[hsl(30,80%,60%)] text-sm font-semibold hover:underline inline-flex items-center gap-1.5"
                      >
                        View Profile <ExternalLink size={13} />
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-6 sm:hidden">
          <Link
            to="/get-listed"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[hsl(30,80%,50%)] text-white font-semibold text-sm hover:bg-[hsl(30,80%,45%)] transition-colors"
          >
            Advertise Here →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedScroller;
