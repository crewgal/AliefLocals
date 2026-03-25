import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { BarChart3, Home, Loader2, Pencil, Star, UploadCloud } from "lucide-react";
import logo from "@/assets/alief-locals-logo.png";

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

const inputClass =
  "w-full rounded-xl border bg-background px-4 py-3 text-base text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20";
const labelClass = "mb-2 block text-xl font-semibold text-accent";

const BusinessSignupPage = () => {
  const { user, loading, signUp } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [contactPerson, setContactPerson] = useState(user?.displayName || "");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [yearsServing, setYearsServing] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [socialMedia, setSocialMedia] = useState("");
  const [description, setDescription] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const welcomeName = businessName.trim() || user?.displayName || "Business Name";

  const handleLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setLogoFileName(file?.name || "");
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    } else {
      setLogoPreview(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthLoading(true);
    setError("");

    try {
      if (!user) {
        await signUp({
          name: contactPerson.trim() || businessName.trim(),
          email,
          password,
        });
      }

      navigate("/business-dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save your business account.");
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-accent text-accent-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link to="/" className="inline-flex w-fit items-center">
            <img src={logo} alt="Alief Locals" className="h-20 w-auto brightness-0 invert" />
          </Link>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-card/20 bg-card/10 px-5 py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-card/20"
            >
              <Home size={18} />
              Home
            </Link>
            <Link
              to="/business-dashboard"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-card transition-opacity hover:opacity-90"
            >
              <BarChart3 size={18} />
              View Stats
            </Link>
            <a
              href="#business-profile-form"
              className="inline-flex items-center gap-2 rounded-2xl border border-card/20 bg-card px-5 py-3 text-sm font-semibold text-card-foreground shadow-card transition-colors hover:bg-muted"
            >
              <Pencil size={18} />
              Edit Profile
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border bg-card p-5 shadow-card sm:p-8 lg:p-10"
        >
          <div className="space-y-4 text-center">
            <p className="text-3xl font-serif font-semibold text-accent sm:text-4xl">
              Welcome, <span className="text-primary">[{welcomeName}]</span>!
            </p>
            <div className="h-px bg-border" />
            <h1 className="text-3xl font-serif font-semibold text-accent sm:text-5xl">
              Complete Your Business Profile
            </h1>
            <div className="h-px bg-border" />
          </div>

          {!user && (
            <div className="mt-8 rounded-3xl border bg-background p-6 shadow-sm">
              <h2 className="text-2xl font-serif font-semibold text-accent">Create Your Business Account</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Add your email and password, then save the full business profile below.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required={!user}
                    placeholder="you@business.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required={!user}
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          <form id="business-profile-form" onSubmit={handleSubmit} className="mt-8 space-y-8">
            <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
              <div className="flex flex-col items-center gap-4">
                <label
                  htmlFor="business-logo-upload"
                  className="flex aspect-square w-full max-w-[240px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border-4 border-border bg-muted px-8 text-center transition-colors hover:border-primary/40"
                >
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo preview" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <UploadCloud size={34} className="mb-4 text-primary" />
                      <span className="text-2xl font-semibold leading-tight text-accent">
                        Upload Your Logo
                      </span>
                      <span className="mt-4 rounded-xl border bg-card px-5 py-3 text-sm font-semibold text-foreground shadow-sm">
                        Click to Upload
                      </span>
                    </>
                  )}
                </label>
                <p className="text-center text-sm text-muted-foreground">
                  {logoFileName || "No file chosen"}
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(event) => setBusinessName(event.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(event) => setContactPerson(event.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Business Address</label>
                  <input
                    type="text"
                    value={businessAddress}
                    onChange={(event) => setBusinessAddress(event.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Type of Business</label>
                  <select
                    value={businessType}
                    onChange={(event) => setBusinessType(event.target.value)}
                    required
                    className={inputClass}
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Years Serving Alief</label>
                  <input
                    type="text"
                    value={yearsServing}
                    onChange={(event) => setYearsServing(event.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Website <span className="text-base font-normal text-muted-foreground">(Optional)</span></label>
                  <input
                    type="url"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                    placeholder="https://yourbusiness.com"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Social Media Links <span className="text-base font-normal text-muted-foreground">(Optional)</span></label>
                  <input
                    type="text"
                    value={socialMedia}
                    onChange={(event) => setSocialMedia(event.target.value)}
                    placeholder="Facebook, Instagram, YouTube, TikTok"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Short Description / About</label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                    required
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center">
                  <span className="text-lg font-semibold text-accent">Upload Logo:</span>
                  <label
                    htmlFor="business-logo-upload"
                    className="inline-flex w-fit cursor-pointer items-center rounded-xl border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Choose File
                  </label>
                  <span className="text-sm text-muted-foreground">
                    {logoFileName || "No file chosen"}
                  </span>
                </div>
              </div>
            </div>

            <input
              id="business-logo-upload"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="sr-only"
            />

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={authLoading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {authLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                Save Profile
              </button>
              <button
                type="button"
                onClick={() => navigate("/business-dashboard")}
                className="inline-flex flex-1 items-center justify-center rounded-2xl border bg-muted px-6 py-4 text-lg font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Skip for Now
              </button>
            </div>
          </form>
        </motion.section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border bg-card p-6 shadow-card">
            <div className="mb-4 flex items-center gap-3">
              <Star size={22} className="fill-primary text-primary" />
              <h2 className="text-2xl font-serif font-semibold text-accent">Customer Reviews</h2>
            </div>
            <div className="flex gap-1 text-primary">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={26} className="fill-primary text-primary" />
              ))}
            </div>
            <p className="mt-4 text-xl italic text-muted-foreground">
              “Great service and very friendly!”
            </p>
          </div>

          <div className="rounded-[2rem] border bg-card p-6 shadow-card">
            <h2 className="text-2xl font-serif font-semibold text-accent">Subscription Plan</h2>
            <p className="mt-5 text-lg font-semibold text-foreground">Current Plan: <span className="text-primary">Free Listing</span></p>
            <p className="mt-2 text-sm text-muted-foreground">
              Upgrade to <strong>Premium ($25/month)</strong> to get featured on the homepage, priority in search results, a verified badge, and social media shoutouts.
            </p>
            <Link
              to="/business-dashboard"
              className="mt-5 inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Upgrade to Premium — $25/mo
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BusinessSignupPage;
