import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { Monitor } from "lucide-react";

const isPreview = window.location.hostname.includes("preview") || window.location.hostname === "localhost";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import {
  Building2,
  Briefcase,
  Users,
  Star,
  Settings,
  Plus,
  ArrowRight,
  LogOut,
  BarChart3,
  MessageSquare,
} from "lucide-react";

const dashboardCards = [
  {
    title: "Business Profile",
    description: "Set up and manage your business listing, add photos, and update your info.",
    icon: Building2,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    link: "/businesses",
    action: "Manage Profile",
  },
  {
    title: "Post a Job",
    description: "Create job listings to find local talent in the Alief community.",
    icon: Briefcase,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    link: "/post-job",
    action: "Post New Job",
  },
  {
    title: "Find Customers",
    description: "Browse community posts and connect with residents who need your services.",
    icon: Users,
    color: "bg-orange-50 text-orange-600 border-orange-200",
    link: "/community",
    action: "Browse Community",
  },
  {
    title: "Reviews",
    description: "View and respond to customer reviews about your business.",
    icon: Star,
    color: "bg-amber-50 text-amber-600 border-amber-200",
    link: "/businesses",
    action: "View Reviews",
  },
  {
    title: "Messages",
    description: "Chat with potential customers and respond to inquiries.",
    icon: MessageSquare,
    color: "bg-purple-50 text-purple-600 border-purple-200",
    link: "/messages",
    action: "Open Messages",
  },
  {
    title: "Analytics",
    description: "Track views, clicks, and engagement on your business listing.",
    icon: BarChart3,
    color: "bg-cyan-50 text-cyan-600 border-cyan-200",
    link: "#",
    action: "Coming Soon",
  },
];

const BusinessDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 bg-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-lg"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Building2 size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-semibold text-foreground mb-3">
              Business Dashboard
            </h1>
            <p className="text-muted-foreground mb-8">
              Sign in to manage your business profile, post jobs, connect with customers, and grow your business in the Alief community.
            </p>
            <button
              onClick={() => setShowAuth(true)}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Business Login
            </button>
            <Link
              to="/"
              className="block mt-4 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </div>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} accountType="business" />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-serif font-semibold text-foreground">
                Welcome back, {user.displayName || user.email?.split("@")[0]}
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your business and connect with the Alief community.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="px-4 py-2 text-sm font-medium text-orange-500 border border-orange-300 rounded-full hover:bg-orange-50 transition-colors"
              >
                Back to Home
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground border rounded-full hover:text-foreground transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Profile Views", value: "—", icon: Building2 },
              { label: "Active Jobs", value: "0", icon: Briefcase },
              { label: "Reviews", value: "—", icon: Star },
              { label: "Messages", value: "0", icon: MessageSquare },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border rounded-xl p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <stat.icon size={14} />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {dashboardCards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to={card.link}
                  className="block bg-card border rounded-2xl p-6 hover:shadow-md transition-shadow group"
                >
                  <div className={`w-12 h-12 rounded-xl ${card.color} border flex items-center justify-center mb-4`}>
                    <card.icon size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{card.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    {card.action} <ArrowRight size={14} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessDashboard;
