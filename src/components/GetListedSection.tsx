import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const perks = [
  "Custom profile so your business is easy to find",
  "Regular social media shoutouts",
  "Featured in our community newsletter",
];

const GetListedSection = () => {
  return (
    <section id="get-listed" className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-foreground mb-3 sm:mb-4">
            Apply to Be Featured
          </h2>
          <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base">
            Get more customers by being recognized as a trusted business in our community.
          </p>
          <p className="text-sm font-semibold text-foreground mb-1">
            Getting Featured Is Free, But Invitation Only
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
            Submitting an application does not guarantee acceptance. We will review and respond within three business days.
          </p>
          <h3 className="text-sm font-semibold text-foreground mb-3">What's Included:</h3>
          <ul className="space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
                <span className="text-xs sm:text-sm text-muted-foreground">{perk}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="bg-card border rounded-2xl p-5 sm:p-8 shadow-card space-y-3 sm:space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <h3 className="text-lg sm:text-xl font-serif font-semibold text-foreground mb-2">
            Tell Us About Your Business
          </h3>
          <input
            type="text"
            placeholder="Business Name"
            className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="tel"
            placeholder="Mobile Phone Number"
            className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <select className="w-full px-4 py-3 rounded-lg border bg-background text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option>Serving Harris County residents?</option>
            <option>Yes</option>
            <option>No</option>
          </select>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Apply Now
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default GetListedSection;
