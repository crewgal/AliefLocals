import { motion } from "framer-motion";
import aliefBuilding from "@/assets/alief-building.png";
import aliefFood from "@/assets/alief-food.png";
import aliefNature from "@/assets/alief-nature.png";
import aliefHeb from "@/assets/alief-heb.png";
import aliefAerial from "@/assets/alief-aerial.png";
import aliefShopping from "@/assets/alief-shopping.png";

// Add more images here — just add { src: importedImage, alt: "description" }
const images = [
  { src: aliefBuilding, alt: "Alief Community Center" },
  { src: aliefFood, alt: "Bellaire Food Street near Alief" },
  { src: aliefHeb, alt: "HEB grocery store in Alief" },
  { src: aliefNature, alt: "Nature trail in Alief area" },
  { src: aliefAerial, alt: "Aerial view of Alief neighborhood" },
  { src: aliefShopping, alt: "Shopping and entertainment in Alief" },
];

// Duplicate for seamless infinite scroll
const scrollImages = [...images, ...images];

const FounderSection = () => {
  return (
    <section className="py-[15vh] bg-foreground overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
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
          <p className="text-lg text-white/75 leading-relaxed mb-6">
            From the famous Bellaire Food Street to the brand-new Alief Community Center,
            our neighborhood is thriving. Whether you need a trusted mechanic, a great barber,
            or a new church home — the best businesses in 77083 are right here, run by your neighbors.
          </p>
          <p className="text-base text-white/55 leading-relaxed">
            Alief Locals is built to help you discover these hidden gems. Our listings are
            <strong className="text-white"> free, but invitation-only</strong> — you're not seeing
            who paid the most to be here. You're seeing business owners who earned their spot
            because they're proud of what they do and stand behind their work.
          </p>
        </motion.div>
      </div>

      {/* Infinite auto-scrolling carousel */}
      <div className="relative w-full">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-foreground to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-foreground to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-5 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {scrollImages.map((img, i) => (
            <div
              key={`${img.alt}-${i}`}
              className="flex-shrink-0 w-[350px] md:w-[420px] aspect-[16/10] rounded-2xl overflow-hidden"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;
