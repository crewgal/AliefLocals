import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/AuthModal";
import Navbar from "@/components/Navbar";
import BusinessSidebar from "@/components/business/BusinessSidebar";
import BusinessRightSidebar from "@/components/business/BusinessRightSidebar";
import LeadMarketplace from "@/components/business/LeadMarketplace";
import ApplyFeatured from "@/components/business/ApplyFeatured";
import { motion } from "framer-motion";
import {
  Building2,
  Briefcase,
  Star,
  MessageSquare,
  Monitor,
  LogOut,
  Eye,
  Users,
} from "lucide-react";

const isPreview = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const BusinessDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user && !previewMode) {
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

            {isPreview && (
              <div className="mt-8 border-t border-orange-500/20 pt-6">
                <p className="text-xs text-orange-400 mb-2 flex items-center justify-center gap-1">
                  <Monitor size={14} /> Preview Environment Detected
                </p>
                <button
                  onClick={() => setPreviewMode(true)}
                  className="w-full px-6 py-3 rounded-xl border-2 border-orange-500 text-orange-500 font-semibold text-sm hover:bg-orange-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Monitor size={18} />
                  Enter Dashboard (Preview Mode)
                </button>
              </div>
            )}
          </motion.div>
        </div>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} accountType="business" />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-background">
        <BusinessSidebar />

        <div className="flex-1 min-w-0 overflow-y-auto">
          {/* Top bar with stats */}
          <div className="border-b bg-card px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <h1 className="text-xl font-serif font-semibold text-foreground">
                Welcome, {user?.displayName || user?.email?.split("@")[0] || "Business Owner"}
              </h1>
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="px-3 py-1.5 text-xs font-medium text-orange-500 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Back to Home
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground border rounded-lg hover:text-foreground transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "New Leads", value: "7", icon: Users, color: "text-primary" },
                { label: "Messages", value: "3", sublabel: "from Customers", icon: MessageSquare, color: "text-emerald-600" },
                { label: "Profile Views", value: "41", icon: Eye, color: "text-blue-600" },
                { label: "Job Applicants", value: "8", icon: Briefcase, color: "text-amber-600" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 bg-background border rounded-xl p-3">
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    {stat.sublabel && <p className="text-[10px] text-muted-foreground">{stat.sublabel}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex">
            <div className="flex-1 min-w-0 p-6">
              <LeadMarketplace />
              <ApplyFeatured />
            </div>
            <BusinessRightSidebar />
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessDashboard;
