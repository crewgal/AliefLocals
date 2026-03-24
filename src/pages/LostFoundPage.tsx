import { useState } from "react";
import { Link } from "react-router-dom";
import SocialLayout from "@/layouts/SocialLayout";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import { PawPrint, Plus, MapPin, Clock, Phone, Home, Monitor, Search } from "lucide-react";
import { motion } from "framer-motion";

const isPreview = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const sampleItems = [
  {
    id: 1,
    type: "lost" as const,
    title: "Lost Golden Retriever",
    description: "Last seen near Alief Community Park on Bellaire Blvd. Answers to 'Buddy'. Wearing a red collar with tags.",
    location: "Bellaire Blvd & Dairy Ashford",
    date: "March 22, 2026",
    contact: "(832) 555-0147",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    type: "found" as const,
    title: "Found Tabby Cat",
    description: "Found a friendly tabby cat near Alief-Hastings High School. Very affectionate, appears well-cared for.",
    location: "Cook Rd & Alief Clodine",
    date: "March 21, 2026",
    contact: "(281) 555-0293",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    type: "lost" as const,
    title: "Lost Chihuahua Mix",
    description: "Small tan and white chihuahua mix. Very shy. Last seen running toward the Alief library area.",
    location: "Bellfort Ave & Synott Rd",
    date: "March 20, 2026",
    contact: "(713) 555-0381",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    type: "found" as const,
    title: "Found Parrot",
    description: "Green parrot found on our porch. Says 'hello' and 'pretty bird'. Seems domesticated.",
    location: "Boone Rd & Bellaire Blvd",
    date: "March 19, 2026",
    contact: "(832) 555-0512",
    image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop",
  },
];

const LostFoundPage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "lost" | "found">("all");
  const [showAuth, setShowAuth] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const filtered = filter === "all" ? sampleItems : sampleItems.filter((i) => i.type === filter);

  if (!user && !previewMode) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-full">
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
        <div className="max-w-md w-full bg-card border rounded-2xl p-8 text-center shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <PawPrint size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Lost & Found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Help reunite pets with their owners. Sign in to post lost or found animals in the Alief community.
          </p>
          <button onClick={() => setShowAuth(true)} className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
            Sign In to Continue
          </button>
          {isPreview && (
            <div className="border-t border-orange-500/20 pt-4">
              <p className="text-xs text-orange-400 mb-2 flex items-center justify-center gap-1">
                <Monitor size={14} /> Preview Environment
              </p>
              <button onClick={() => setPreviewMode(true)} className="w-full px-6 py-3 rounded-xl border-2 border-orange-500 text-orange-500 font-semibold text-sm hover:bg-orange-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                <Monitor size={18} />
                Enter Lost & Found (Preview)
              </button>
            </div>
          )}
        </div>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} accountType="customer" />
      </div>
    );
  }

  return (
    <SocialLayout>
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-foreground flex items-center gap-2">
              <PawPrint size={28} className="text-primary" />
              Lost & Found
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Help reunite pets with their families in Alief</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
            <Plus size={16} />
            Report
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {(["all", "lost", "found"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f
                  ? f === "lost"
                    ? "bg-destructive text-destructive-foreground"
                    : f === "found"
                    ? "bg-green-600 text-white"
                    : "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f === "all" ? "All" : f === "lost" ? "🔴 Lost" : "🟢 Found"}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-48 h-48 sm:h-auto">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                        item.type === "lost"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      }`}
                    >
                      {item.type}
                    </span>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={12} /> {item.contact}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search tip */}
        <div className="bg-muted/50 border rounded-xl p-4 text-center space-y-2">
          <Search size={20} className="mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Can't find what you're looking for? Post a report and the community will help!
          </p>
        </div>
      </div>
    </SocialLayout>
  );
};

export default LostFoundPage;
