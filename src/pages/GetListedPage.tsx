import Navbar from "@/components/Navbar";
import GetListedSection from "@/components/GetListedSection";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const GetListedPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
      <GetListedSection />
    </div>
  );
};

export default GetListedPage;
