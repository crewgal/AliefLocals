import { useEffect, useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ExternalLink, Star, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import sthillAd from "@/assets/ads/sthillstudios-ad.png";

interface FeaturedSlide {
  type: "image-ad" | "cta";
  name: string;
  slug: string;
  image?: string;
  link?: string;
}

const featuredSlides: FeaturedSlide[] = [
  {
    type: "image-ad",
    name: "STHill Studios",
    slug: "sthillstudios",
    image: sthillAd,
  },
  {
    type: "cta",
    name: "Your Business Here 1",
    slug: "get-listed",
    link: "/get-listed",
  },
  {
    type: "cta",
    name: "Your Business Here 2",
    slug: "get-listed",
    link: "/get-listed",
  },
  {
    type: "cta",
    name: "Your Business Here 3",
    slug: "get-listed",
    link: "/get-listed",
  },
  {
    type: "cta",
    name: "Your Business Here 4",
    slug: "get-listed",
    link: "/get-listed",
  },
  {
    type: "cta",
    name: "Your Business Here 5",
    slug: "get-listed",
    link: "/get-listed",
  },
];

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
    <section className="py-8 sm:py-12 px-4 sm:px-6 bg-[hsl(200,25%,12%)] relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(30,80%,50%,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(200,60%,40%,0.06),transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-[hsl(30,80%,50%,0.15)] text-[hsl(30,80%,65%)] px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
            <Star size={14} /> Sponsored
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-white mb-3 sm:mb-4">
            Featured Businesses
          </h2>
          <Link
            to="/get-listed"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[hsl(30,80%,50%)] text-white font-semibold text-xs sm:text-sm hover:bg-[hsl(30,80%,45%)] transition-colors"
          >
            Advertise Here →
          </Link>
        </motion.div>

        <div className="relative">
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute -left-1 sm:left-1 md:left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[hsl(43,80%,50%)]/20 backdrop-blur-sm border-2 border-[hsl(43,80%,55%)] flex items-center justify-center hover:bg-[hsl(43,80%,50%)]/40 transition-colors disabled:opacity-30 text-[hsl(43,80%,55%)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_15px_hsl(43,80%,50%,0.3)]"
            disabled={!canScrollPrev}
            aria-label="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute -right-1 sm:right-1 md:right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[hsl(43,80%,50%)]/20 backdrop-blur-sm border-2 border-[hsl(43,80%,55%)] flex items-center justify-center hover:bg-[hsl(43,80%,50%)]/40 transition-colors disabled:opacity-30 text-[hsl(43,80%,55%)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_15px_hsl(43,80%,50%,0.3)]"
            disabled={!canScrollNext}
            aria-label="Next"
          >
            <ChevronRight size={18} />
          </button>

          <div className="overflow-hidden px-10 sm:px-14 md:px-16" ref={emblaRef}>
            <div className="flex -ml-3 sm:-ml-4">
              {featuredSlides.map((slide) => (
                <div
                  key={slide.name}
                  className="flex-[0_0_85%] sm:flex-[0_0_55%] lg:flex-[0_0_40%] min-w-0 pl-3 sm:pl-4"
                >
                  {slide.type === "image-ad" ? (
                      <div className="block h-full">
                        <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 h-full min-h-[280px] sm:min-h-[400px] border border-white/10 bg-[hsl(215,65%,18%)] p-3 sm:p-5 flex flex-col items-center justify-center relative">
                          <img
                            src={slide.image}
                            alt={slide.name}
                            className="block w-[96%] h-auto object-contain object-center mx-auto mt-2"
                          />
                        </div>
                      </div>
                  ) : slide.type === "cta" ? (
                    <Link to="/get-listed" className="block h-full">
                      <div className="rounded-2xl border-2 border-dashed border-[hsl(30,80%,50%,0.5)] bg-[hsl(30,80%,50%,0.08)] p-5 sm:p-8 h-full flex flex-col items-center justify-center text-center hover:bg-[hsl(30,80%,50%,0.15)] transition-colors duration-300 min-h-[280px] sm:min-h-[400px]">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[hsl(30,80%,50%,0.2)] flex items-center justify-center mb-3 sm:mb-4">
                          <Plus size={22} className="text-[hsl(30,80%,65%)]" />
                        </div>
                        <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-1 sm:mb-2">
                          Your Business
                        </h3>
                        <h3 className="text-base sm:text-lg font-serif font-bold text-[hsl(30,80%,60%)] mb-2 sm:mb-3">
                          Can Be Here!
                        </h3>
                        <p className="text-white/50 text-[10px] sm:text-xs mb-3 sm:mb-4">
                          Starting at just $25/mo
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-[hsl(30,80%,60%)] text-xs sm:text-sm font-semibold">
                          Get Featured <ExternalLink size={13} />
                        </span>
                      </div>
                    </Link>
                  ) : null}
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
