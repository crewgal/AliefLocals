import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Store, Globe2, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { icon: Users, value: 100000, suffix: "+", label: "Residents in Alief" },
  { icon: Globe2, value: 40, suffix: "+", label: "Nationalities Represented" },
  { icon: Store, value: 200, suffix: "+", label: "Local Businesses" },
  { icon: Heart, value: 18, suffix: " yrs", label: "Serving Our Community" },
];

function AnimatedNumber({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span className="font-mono-stat text-2xl sm:text-4xl md:text-5xl font-bold text-primary">
      {target >= 1000 ? count.toLocaleString() : count}
      {suffix}
    </span>
  );
}

const CommunityStats = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();

  return (
    <section ref={ref} className="py-12 sm:py-20 px-4 sm:px-6 bg-card border-y">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-foreground mb-3">
            {t("Alief by the Numbers")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
            {t("One of the most culturally rich neighborhoods in the entire United States.")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <Icon size={24} className="mx-auto mb-2 sm:mb-4 text-primary/70" strokeWidth={1.5} />
                <AnimatedNumber target={stat.value} suffix={stat.suffix} inView={inView} />
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">{t(stat.label)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CommunityStats;
