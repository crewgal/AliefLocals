import { motion } from "framer-motion";
import {
  UtensilsCrossed, Wrench, Smile, ShieldCheck, Scissors,
  Church, Car, Stethoscope, Home, GraduationCap, Dumbbell, ShoppingBag,
} from "lucide-react";

const categories = [
  { name: "Restaurants", icon: UtensilsCrossed, count: 24 },
  { name: "Mechanics", icon: Wrench, count: 12 },
  { name: "Dentists", icon: Smile, count: 8 },
  { name: "Car Insurance", icon: ShieldCheck, count: 6 },
  { name: "Barber Shops", icon: Scissors, count: 15 },
  { name: "Churches", icon: Church, count: 18 },
  { name: "Car Dealerships", icon: Car, count: 9 },
  { name: "Clinics", icon: Stethoscope, count: 11 },
  { name: "Real Estate", icon: Home, count: 7 },
  { name: "Tutoring", icon: GraduationCap, count: 5 },
  { name: "Fitness", icon: Dumbbell, count: 10 },
  { name: "Shopping", icon: ShoppingBag, count: 14 },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
};

const CategoryGrid = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-3">
          Browse by Category
        </h2>
        <p className="text-muted-foreground mb-10 max-w-lg">
          Every listing is vetted. Every business is local. Find exactly what you need in Alief.
        </p>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={container}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.a
                key={cat.name}
                href={`#${cat.name.toLowerCase().replace(/\s/g, "-")}`}
                variants={item}
                className="group bg-card border rounded-xl p-6 hover:border-primary transition-all duration-300 hover:scale-[1.01] shadow-card cursor-pointer"
              >
                <Icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors mb-4" strokeWidth={1.5} />
                <p className="font-semibold text-foreground text-sm mb-1">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.count} listings in Alief</p>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryGrid;
