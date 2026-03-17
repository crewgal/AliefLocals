import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface Business {
  name: string;
  description: string;
  image?: string;
  initials?: string;
  color?: string;
}

const businesses: Business[] = [
  {
    name: "Trojan Grill",
    description: "Get American Cuisine such as burgers, sandwiches, salads, delicious entrees, and desserts. Live music every month.",
    initials: "TG",
    color: "hsl(var(--primary))",
  },
  {
    name: "Sirius and the Wren",
    description: "Heart centered Reiki healing for people and animals, promoting balance, well-being, and natural energy flow.",
    initials: "SW",
    color: "hsl(210 50% 40%)",
  },
  {
    name: "Infinity Coordinator",
    description: "Expert event decorator and coordinator creating affordable weddings and celebrations with creativity and care.",
    initials: "IC",
    color: "hsl(340 60% 50%)",
  },
  {
    name: "Beth Baldwin Real Estate",
    description: "New Kent Broker dedicated to exceptional service, effective marketing, and successful client experiences.",
    initials: "BB",
    color: "hsl(210 30% 30%)",
  },
  {
    name: "Pigeon & Co",
    description: "A unique shopping experience featuring a mix of refurbished, new, artistic, and vintage finds.",
    initials: "PC",
    color: "hsl(150 40% 40%)",
  },
  {
    name: "Cindy Steele Real Estate",
    description: "Cindy Steele is a top-producing agent with Howard & Hanna, helping hundreds live the American dream.",
    initials: "CS",
    color: "hsl(280 50% 45%)",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const FeaturedBusinesses = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-3"
        >
          Recently Added Local Businesses
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground"
        >
          Check out these hometown favorites!
        </motion.p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        variants={container}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {businesses.map((biz) => (
          <motion.div
            key={biz.name}
            variants={item}
            className="bg-card border rounded-2xl p-6 shadow-card hover:shadow-elevated transition-shadow duration-300 flex flex-col items-center text-center"
          >
            {/* Logo / Initials */}
            <div
              className="w-24 h-24 rounded-xl flex items-center justify-center mb-5 text-white text-2xl font-serif font-bold"
              style={{ backgroundColor: biz.color }}
            >
              {biz.initials}
            </div>

            <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
              {biz.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 max-w-xs">
              {biz.description}
            </p>
            <a
              href="#"
              className="text-primary text-sm font-semibold hover:underline inline-flex items-center gap-1.5"
            >
              View Profile <ExternalLink size={13} />
            </a>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedBusinesses;
