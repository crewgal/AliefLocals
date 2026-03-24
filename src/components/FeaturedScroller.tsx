import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ExternalLink, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import sthillAd from "@/assets/ads/sthillstudios-ad.png";

interface FeaturedSlide {
  type: "image-ad" | "business";
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
    color: "hsl(var(--primary))",
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
  gold: { label: "⭐ Gold", className: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400" },
  silver: { label: "Silver", className: "bg-muted text-muted-foreground" },
  bronze: { label: "Bronze", className: "bg-orange-500/15 text-orange-700 dark:text-orange-400" },
};

const FeaturedScroller = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [Autoplay({ delay: 4000, stopOnInteraction: true, stopOnMouseEnter: true })]
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
    <section className="py-16 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Star size={14} /> Featured Businesses
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-3">
            Our Premium Partners
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            These trusted local businesses invest in our community. Support them and they'll support you!
          </p>
        </motion.div>

        <div className="relative">
          {/* Prev / Next buttons */}
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background border shadow-card flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
            disabled={!canScrollPrev}
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background border shadow-card flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
            disabled={!canScrollNext}
            aria-label="Next"
          >
            <ChevronRight size={20} />
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
                      <div className="rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300 h-full">
                        <img
                          src={slide.image}
                          alt={slide.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>
                  ) : (
                    <div className="bg-card border rounded-2xl p-6 shadow-card hover:shadow-elevated transition-shadow duration-300 h-full flex flex-col items-center text-center">
                      <div className="flex items-center gap-2 mb-4 w-full justify-between">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${tierBadge[slide.tier!].className}`}>
                          {tierBadge[slide.tier!].label}
                        </span>
                        <span className="text-[10px] text-muted-foreground">Sponsored</span>
                      </div>

                      <div
                        className="w-20 h-20 rounded-xl flex items-center justify-center mb-4 text-white text-xl font-serif font-bold shadow-md"
                        style={{ backgroundColor: slide.color }}
                      >
                        {slide.initials}
                      </div>

                      <h3 className="text-base font-serif font-semibold text-foreground mb-2">
                        {slide.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {slide.description}
                      </p>

                      <Link
                        to={`/business/${slide.slug}`}
                        className="mt-auto text-primary text-sm font-semibold hover:underline inline-flex items-center gap-1.5"
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

        <div className="text-center mt-8">
          <Link
            to="/get-listed"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Get Your Business Featured →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedScroller;
