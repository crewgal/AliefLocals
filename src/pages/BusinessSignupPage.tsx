import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Upload, Building2, Loader2 } from "lucide-react";

const businessTypes = [
  "Restaurant / Food",
  "Automotive",
  "Health & Wellness",
  "Home Services",
  "Beauty & Personal Care",
  "Legal Services",
  "Education & Tutoring",
  "Technology / IT",
  "Graphic Design",
  "Real Estate",
  "Other",
];

const BusinessSignupPage = () => {
  const { user, loading, signUp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"signup" | "profile">(user ? "profile" : "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");

  // Profile fields
  const [businessName, setBusinessName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [yearsServing, setYearsServing] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [description, setDescription] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError("");
    try {
      await signUp({ name, email, password });
      setStep("profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    }
    setAuthLoading(false);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just navigate to dashboard
    navigate("/business-dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // If already logged in, show profile completion
  if (user && step === "signup") {
    setStep("profile");
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background flex items-start justify-center pt-8 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          {step === "signup" ? (
            <div className="bg-card border rounded-2xl p-8 shadow-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-semibold text-foreground">
                    Business Sign Up
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Create your account to get started
                  </p>
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="you@business.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Min 6 characters"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {authLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                  Create Business Account
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-card border rounded-2xl p-8 shadow-card">
              <div className="text-center mb-6">
                <p className="text-primary font-semibold text-sm">
                  Welcome, {user?.displayName || name || "Business Owner"}!
                </p>
                <h1 className="text-2xl font-serif font-semibold text-foreground mt-1">
                  Complete Your Business Profile
                </h1>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Logo upload */}
                <div className="flex justify-center mb-2">
                  <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <Upload size={20} className="text-muted-foreground mb-1" />
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">
                      Upload Your Logo
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Business Address</label>
                  <input
                    type="text"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Type of Business</label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a category</option>
                    {businessTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Years Serving Alief</label>
                  <input
                    type="text"
                    value={yearsServing}
                    onChange={(e) => setYearsServing(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Website <span className="text-muted-foreground font-normal">(Optional)</span></label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Social Media Links <span className="text-muted-foreground font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={socialMedia}
                    onChange={(e) => setSocialMedia(e.target.value)}
                    placeholder="e.g. instagram.com/yourbiz"
                    className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Short Description / About</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Save Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/business-dashboard")}
                    className="flex-1 py-2.5 rounded-full border border-muted-foreground/30 text-foreground font-semibold text-sm hover:bg-muted transition-colors"
                  >
                    Skip for Now
                  </button>
                </div>
              </form>

              {/* Bottom info */}
              <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-foreground">Customer Reviews</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className="text-primary text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">"Great service and very friendly!"</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Subscription Plan</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Current Plan: Free Listing</p>
                  <button className="mt-1 text-[10px] font-semibold text-primary-foreground bg-primary px-3 py-1 rounded-full">
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default BusinessSignupPage;
