import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    quote: "I found my family's new dentist through Alief Locals. It's so much better than scrolling through random Google results — these are real people in our community.",
    name: "Maria G.",
    role: "Alief Resident, 12 years",
  },
  {
    quote: "As a small business owner, getting listed here has brought me customers who actually live nearby. They come back because we're neighbors.",
    name: "James T.",
    role: "Local Mechanic, 77083",
  },
  {
    quote: "This is what our community needed. A place that celebrates the hardworking people who make Alief special, not just whoever has the biggest ad budget.",
    name: "Linda W.",
    role: "Church Leader in Alief",
  },
  {
    quote: "The scavenger hunts and giveaways are so fun! My kids love exploring local businesses. It's brought our family closer to the neighborhood.",
    name: "David K.",
    role: "Alief Parent & Teacher",
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((p) => (p + 1) % testimonials.length);
  const prev = () => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 px-6 bg-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-white mb-2">
            What Our Community Says
          </h2>
          <p className="text-white/50 mb-12">Real voices from real neighbors.</p>
        </motion.div>

        <div className="relative min-h-[220px] flex items-center justify-center">
          <button
            onClick={prev}
            className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={22} className="text-white" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="px-12 md:px-16"
            >
              <Quote size={32} className="mx-auto mb-5 text-primary/60" />
              <blockquote className="text-lg md:text-xl text-white/85 leading-relaxed font-serif italic mb-6">
                "{testimonials[current].quote}"
              </blockquote>
              <p className="text-white font-semibold">{testimonials[current].name}</p>
              <p className="text-white/40 text-sm">{testimonials[current].role}</p>
            </motion.div>
          </AnimatePresence>

          <button
            onClick={next}
            className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors border border-white/10"
            aria-label="Next testimonial"
          >
            <ChevronRight size={22} className="text-white" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current ? "bg-primary scale-125" : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
