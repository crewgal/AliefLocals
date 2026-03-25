import { CheckCircle, Crown } from "lucide-react";
import { useState } from "react";

const CALENDLY_URL = "https://calendly.com/thesthillstudios/sthill-studios-website-design-marketing-and-seo-meeting";

const perks = [
  "Permanent homepage recognition in the Founding 10 section",
  "Rotating banner ad across community & business dashboards",
  "Featured in our community newsletter",
  "Priority placement in search results — forever",
];

const ApplyFeatured = () => {
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
    <div className="bg-card border rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Crown size={20} className="text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">
          Apply to Be a Founder of Alief Locals
        </h2>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Become one of our 10 Founding Sponsors and get lifetime recognition across the entire platform.
      </p>

      <ul className="space-y-2 mb-5">
        {perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2">
            <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
            <span className="text-xs text-muted-foreground">{perk}</span>
          </li>
        ))}
      </ul>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Business Name *"
          required
          value={formData.businessName}
          onChange={(e) => handleChange("businessName", e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="First Name *"
            required
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <input
          type="email"
          placeholder="Email Address *"
          required
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="tel"
          placeholder="Mobile Phone Number"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <select
          value={formData.servingHarris}
          onChange={(e) => handleChange("servingHarris", e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border bg-background text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Serving Harris County residents?</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <button
          type="submit"
          className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Apply Now — Schedule a Call
        </button>
      </form>

      <p className="text-[10px] text-muted-foreground mt-3 text-center">
        After clicking Apply, you'll schedule a quick call with our team to discuss your founding spot.
      </p>
    </div>
  );
};

export default ApplyFeatured;
