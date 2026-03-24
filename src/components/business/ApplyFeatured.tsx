import { CheckCircle, Sparkles } from "lucide-react";

const perks = [
  "Custom profile so your business is easy to find",
  "Regular social media shoutouts",
  "Featured in our community newsletter",
  "Priority placement in search results",
];

const ApplyFeatured = () => {
  return (
    <div className="bg-card border rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">
          Apply to Be Featured
        </h2>
        <span className="ml-auto text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
          $25/month
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Get more customers by being recognized as a trusted business in our community.
      </p>

      <ul className="space-y-2 mb-5">
        {perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
            <span className="text-xs text-muted-foreground">{perk}</span>
          </li>
        ))}
      </ul>

      <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Business Name"
          className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="First Name"
            className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <input
          type="email"
          placeholder="Email Address"
          className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="tel"
          placeholder="Mobile Phone Number"
          className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select className="w-full px-4 py-2.5 rounded-lg border bg-background text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option>Serving Harris County residents?</option>
          <option>Yes</option>
          <option>No</option>
        </select>
        <button
          type="submit"
          className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Apply Now — $25/month
        </button>
      </form>

      <p className="text-[10px] text-muted-foreground mt-3 text-center">
        Getting Featured is by invitation only. We will review and respond within 3 business days.
      </p>
    </div>
  );
};

export default ApplyFeatured;
