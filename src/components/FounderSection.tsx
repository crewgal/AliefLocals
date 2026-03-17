import founderImg from "@/assets/founder-portrait.jpg";
import { motion } from "framer-motion";

const FounderSection = () => {
  return (
    <section className="py-[15vh] bg-foreground">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-background leading-tight mb-6">
            Built by a neighbor,{" "}
            <br />
            <span className="text-primary">driven by a mission.</span>
          </h2>
          <p className="text-lg text-background/75 max-w-prose mb-8 leading-relaxed">
            The best local businesses aren't always the ones with the biggest ad budgets.
            Mission Bend Locals is the place to discover the local gems in our community.
            Our listings are <strong className="text-background">free, but invitation-only</strong>.
            You aren't seeing who paid the most to be here — you're seeing business owners
            who earned their spot because they are proud of what they do and are willing to
            stand behind their work.
          </p>
          <p className="text-base text-background/65 max-w-prose mb-10 leading-relaxed">
            As a Pastor and Evangelist with an MBA and 18 years of professional web design experience,
            I believe our local businesses deserve the same excellence we bring to our faith.
            When you connect with a neighbor who puts their heart into their business,
            you get a higher level of accountability.
          </p>

          <div className="flex gap-8">
            <div>
              <p className="text-3xl font-mono font-bold text-primary">18</p>
              <p className="text-xs uppercase tracking-widest text-background/40 mt-1">Years Design</p>
            </div>
            <div>
              <p className="text-3xl font-mono font-bold text-primary">77083</p>
              <p className="text-xs uppercase tracking-widest text-background/40 mt-1">Local Zip</p>
            </div>
            <div>
              <p className="text-3xl font-mono font-bold text-primary">MBA</p>
              <p className="text-xs uppercase tracking-widest text-background/40 mt-1">Standard</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="aspect-square rounded-2xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700"
          style={{ background: "hsl(var(--background) / 0.1)" }}
        >
          <img
            src={founderImg}
            alt="Adrian — Pastor, MBA, and Web Designer serving Mission Bend"
            className="w-full h-full object-cover object-top"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;
