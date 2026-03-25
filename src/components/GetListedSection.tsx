import { CheckCircle, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const CALENDLY_URL = "https://calendly.com/thesthillstudios/sthill-studios-website-design-marketing-and-seo-meeting";

const perks = [
  "Permanent homepage recognition in the Founding 10 section",
  "Rotating banner ad across community & business dashboards",
  "Featured placement in the sponsored scroller",
  "Lifetime verified badge on your business profile",
  "Priority placement in search results — forever",
  "Social media shoutouts and newsletter features",
  "Direct link to your website from every ad placement",
];

const GetListedSection = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    servingHarris: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.firstName || !formData.email) return;
    window.open(CALENDLY_URL, "_blank");
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="get-listed" className="py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
            <Crown size={14} /> Only 10 Founding Spots Available
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-foreground mb-3 sm:mb-4">
            Apply to Be a Founder of Alief Locals
          </h2>
          <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base">
            Become one of our <strong className="text-foreground">10 Founding Sponsors</strong> — the businesses
            that helped build Alief Locals from the ground up. Founders receive <strong className="text-foreground">lifetime
            recognition and promotion</strong> across every page of our platform.
          </p>

          <div className="bg-muted/50 border rounded-xl p-4 mb-4 sm:mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-1">What is a Founding Sponsor?</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              A Founding Sponsor is one of the original 10 businesses that invest in Alief Locals early.
              In return, your business gets <strong>permanent, lifetime visibility</strong> — your brand will be
              featured on our homepage, community feeds, business dashboards, newsletters, and social media
              for as long as Alief Locals exists. This is a one-time opportunity that will never be offered again.
            </p>
          </div>

          <h3 className="text-sm font-semibold text-foreground mb-3">What Founders Receive:</h3>
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
          onSubmit={handleSubmit}
        >
          <div className="flex items-center gap-2 mb-2">
            <Crown size={18} className="text-primary" />
            <h3 className="text-lg sm:text-xl font-serif font-semibold text-foreground">
              Become a Founding Sponsor
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Fill out your info below, then schedule a quick call with our team to finalize your founding spot.
          </p>
          <input
            type="text"
            placeholder="Business Name *"
            required
            value={formData.businessName}
            onChange={(e) => handleChange("businessName", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <input
              type="text"
              placeholder="First Name *"
              required
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <input
            type="email"
            placeholder="Email Address *"
            required
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="tel"
            placeholder="Mobile Phone Number"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <select
            value={formData.servingHarris}
            onChange={(e) => handleChange("servingHarris", e.target.value)}
            className="w-full px-4 py-3 rounded-lg border bg-background text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Serving Harris County residents?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          <button
            type="submit"
            className="w-full py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Apply Now — Schedule a Call
          </button>
          <p className="text-[10px] text-muted-foreground text-center">
            After clicking Apply, you'll be taken to schedule a quick call with our team to discuss your founding spot.
          </p>
        </motion.form>
      </div>
    </section>
  );
};

export default GetListedSection;
