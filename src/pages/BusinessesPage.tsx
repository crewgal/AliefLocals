import { useState, useEffect } from "react";
import SocialLayout from "@/layouts/SocialLayout";
import { Link } from "react-router-dom";
import { Star, MapPin, Loader2, Search } from "lucide-react";
import { listBusinesses, type Business } from "@/lib/api";
import AIMatchmaker from "@/components/AIMatchmaker";

const categories = [
  "All", "restaurants", "mechanics", "dentists", "car-insurance",
  "barber-shops", "churches", "car-dealerships", "real-estate",
];

const BusinessesPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBusinesses();
  }, [activeCategory]);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      setBusinesses(await listBusinesses(activeCategory !== "All" ? activeCategory : undefined));
    } finally {
      setLoading(false);
    }
  };

  const filtered = search
    ? businesses.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()))
    : businesses;

  return (
    <SocialLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <h1 className="text-xl font-serif font-bold text-foreground">Local Businesses</h1>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search businesses..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat === "All" ? "All" : cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-xl">
            <p className="text-muted-foreground text-sm">No businesses found.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((biz) => (
              <Link
                key={biz.id}
                to={`/business/${biz.slug}`}
                className="bg-card border rounded-xl p-4 shadow-card flex gap-4 hover:shadow-elevated transition-shadow"
              >
                {biz.image_url ? (
                  <img src={biz.image_url} alt={biz.name} className="w-20 h-20 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <MapPin size={24} className="text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{biz.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{biz.category.replace(/-/g, " ")}</p>
                  {biz.address && <p className="text-xs text-muted-foreground mt-1 truncate">{biz.address}</p>}
                  {biz.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-primary mt-1">
                      <Star size={12} className="fill-primary" /> Verified
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SocialLayout>
  );
};

export default BusinessesPage;
