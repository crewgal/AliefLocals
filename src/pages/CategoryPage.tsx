import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { MapPin, Phone, Globe, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const categoryInfo: Record<string, { title: string; description: string }> = {
  restaurants: {
    title: "Restaurants",
    description: "Discover the best local restaurants in Alief — from authentic international cuisine on Bellaire Food Street to family-owned favorites in the 77083.",
  },
  mechanics: {
    title: "Mechanics",
    description: "Find trusted, honest mechanics right here in Alief. These are shops run by your neighbors who stand behind their work.",
  },
  dentists: {
    title: "Dentists",
    description: "Quality dental care from local professionals who know and serve the Alief community.",
  },
  "car-insurance": {
    title: "Car Insurance",
    description: "Get covered by local insurance agents who understand the needs of Alief drivers.",
  },
  "barber-shops": {
    title: "Barber Shops",
    description: "The best barbers in Alief — clean cuts, great vibes, and community pride.",
  },
  churches: {
    title: "Churches",
    description: "Find your church home in Alief. Our diverse community is home to congregations of every background.",
  },
  "car-dealerships": {
    title: "Car Dealerships",
    description: "Shop local for your next vehicle from trusted dealerships in the Alief area.",
  },
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const info = categoryInfo[slug || ""] || { title: "Category", description: "" };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-foreground mb-4">
            {info.title} <span className="text-primary">in Alief</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-12 leading-relaxed">
            {info.description}
          </p>
        </motion.div>

        {/* Placeholder listings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-card border rounded-2xl p-10 text-center shadow-card"
        >
          <p className="text-muted-foreground text-lg mb-2">
            Listings coming soon!
          </p>
          <p className="text-sm text-muted-foreground/70">
            We're currently vetting businesses for this category. Want to be featured?
          </p>
          <Link
            to="/get-listed"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Apply to Get Listed
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;
