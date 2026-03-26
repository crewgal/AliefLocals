import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-20 px-6 bg-primary/5 border-y">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
          <Gift size={36} className="mx-auto mb-4 text-primary" strokeWidth={1.5} />
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-3">
            {t("Get News & Win Prizes")} 🎉
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            {t("Join our newsletter for exclusive giveaways, local business spotlights, scavenger hunts, and community events in Alief.")}
          </p>
        </motion.div>

        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border rounded-2xl p-8 shadow-card">
            <p className="text-lg font-semibold text-foreground mb-1">{t("You're in!")} 🎉</p>
            <p className="text-sm text-muted-foreground">{t("Check your inbox for a welcome message and your first chance to win.")}</p>
          </motion.div>
        ) : (
          <motion.form initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("Email Address")} className="w-full pl-11 pr-4 py-4 rounded-full border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <button type="submit" className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
              {t("Get News & Win Prizes")} 🎁
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
};

export default NewsletterSignup;
