import { useState } from "react";
import { Sparkles, Loader2, Star, ArrowRight, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface Match {
  name: string;
  slug: string;
  reason: string;
  confidence: "high" | "medium" | "low";
}

const exampleQueries = [
  "I need a plumber who speaks Vietnamese",
  "Best tacos near Bellaire Blvd",
  "Affordable mechanic for my Honda",
  "Barber who does fades for kids",
  "Dentist that takes Medicaid",
];

const AIMatchmaker = () => {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setError("");
    setMatches([]);
    setSuggestion("");
    setHasSearched(true);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("ai-match", {
        body: { query: q.trim() },
      });

      if (fnError) throw fnError;

      setMatches(data.matches || []);
      setSuggestion(data.suggestion || "");
    } catch (e) {
      setError("Couldn't reach the matchmaker right now. Try searching the directory instead!");
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = (c: string) => {
    if (c === "high") return "bg-green-500/20 text-green-400 border-green-500/30";
    if (c === "medium") return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-muted text-muted-foreground border-border";
  };

  return (
    <div className="bg-card border rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-6 border-b">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles size={18} className="text-primary" />
          </div>
          <h2 className="text-lg font-serif font-bold text-foreground">AI Business Matchmaker</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Describe what you need in plain language — we'll find the perfect local business for you.
        </p>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. 'I need a plumber who speaks Vietnamese'"
            className="w-full pl-10 pr-12 py-3 rounded-xl bg-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            maxLength={500}
          />
          {query && (
            <button onClick={() => { setQuery(""); setHasSearched(false); setMatches([]); }} className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          )}
          <button
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
          </button>
        </div>

        {/* Example queries */}
        {!hasSearched && (
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((eq) => (
              <button
                key={eq}
                onClick={() => { setQuery(eq); handleSearch(eq); }}
                className="text-xs px-3 py-1.5 rounded-full border bg-muted/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                {eq}
              </button>
            ))}
          </div>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 py-8 text-muted-foreground text-sm"
            >
              <Sparkles size={16} className="animate-pulse text-primary" />
              Finding the best match for you...
            </motion.div>
          )}

          {!loading && error && (
            <motion.p key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive text-center py-4">
              {error}
            </motion.p>
          )}

          {!loading && hasSearched && matches.length > 0 && (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {matches.length} match{matches.length !== 1 ? "es" : ""} found
              </p>
              {matches.map((m, i) => (
                <motion.div
                  key={m.slug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={`/business/${m.slug}`}
                    className="block p-4 rounded-xl border bg-background hover:shadow-elevated transition-shadow group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {m.name}
                          </h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${confidenceColor(m.confidence)}`}>
                            {m.confidence}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{m.reason}</p>
                      </div>
                      <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && hasSearched && matches.length === 0 && !error && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-6 space-y-2">
              <p className="text-sm text-muted-foreground">{suggestion || "No matches found for your request."}</p>
              <Link to="/businesses" className="text-sm text-primary font-medium hover:underline">
                Browse all businesses →
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIMatchmaker;
