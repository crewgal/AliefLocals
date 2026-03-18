import SocialLayout from "@/layouts/SocialLayout";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: "$29",
    duration: "30 days",
    features: ["Listed on jobs board", "Company name & logo", "Basic formatting"],
  },
  {
    name: "Featured",
    price: "$59",
    duration: "30 days",
    popular: true,
    features: ["Everything in Basic", "Highlighted listing", "Pinned to top for 7 days", "Shared on social media"],
  },
  {
    name: "Premium",
    price: "$99",
    duration: "60 days",
    features: ["Everything in Featured", "Pinned to top for 30 days", "Newsletter feature", "Dedicated social post"],
  },
];

const PostJobPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("Featured");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <SocialLayout>
        <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="max-w-xl mx-auto px-6 py-32 text-center">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-primary" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-foreground mb-3">Job Submitted!</h2>
            <p className="text-muted-foreground mb-8">
              We'll review your listing and have it live within 24 hours. You'll receive a confirmation email shortly.
            </p>
            <Link to="/jobs" className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity">
              Browse Jobs
            </Link>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-14">
        <Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-block">
          ← Back to Jobs
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            Post a Job in Alief
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Reach local talent in the Alief community. Choose a plan and fill in your job details.
          </p>
        </motion.div>

        {/* Pricing Plans */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {plans.map((plan, i) => (
            <motion.button
              key={plan.name}
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedPlan(plan.name)}
              className={`relative text-left rounded-2xl border-2 p-6 transition-all ${
                selectedPlan === plan.name
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-card hover:border-muted-foreground/30"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 px-3 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="font-semibold text-foreground text-lg mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/ {plan.duration}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle size={14} className="text-primary mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.button>
          ))}
        </div>

        {/* Job Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="bg-card rounded-2xl border p-8 max-w-2xl"
        >
          <h2 className="font-serif text-xl font-bold text-foreground mb-6">Job Details</h2>
          <div className="grid gap-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Job Title *</label>
                <input required className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Line Cook" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Company Name *</label>
                <input required className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Your business name" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Location *</label>
                <input required className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. Alief, TX" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Job Type *</label>
                <select required className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select type</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Flexible</option>
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Salary / Pay Range</label>
                <input className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="e.g. $15-$20/hr" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Contact Email *</label>
                <input required type="email" className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="you@company.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Job Description *</label>
              <textarea required rows={5} className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" placeholder="Describe the role, responsibilities, and requirements..." />
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Selected plan: <span className="font-semibold text-foreground">{selectedPlan}</span>
            </p>
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              Submit & Pay
            </button>
          </div>
        </motion.form>
      </section>

      <Footer />
    </div>
  );
};

export default PostJobPage;
