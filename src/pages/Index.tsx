import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CommunityStats from "@/components/CommunityStats";
import CategoryGrid from "@/components/CategoryGrid";
import FounderSection from "@/components/FounderSection";
import FeaturedScroller from "@/components/FeaturedScroller";
import FeaturedBusinesses from "@/components/FeaturedBusinesses";
import Testimonials from "@/components/Testimonials";
import NewsletterSignup from "@/components/NewsletterSignup";
import JobsSection from "@/components/JobsSection";
import GetListedSection from "@/components/GetListedSection";
import TrustBadge from "@/components/TrustBadge";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CommunityStats />
      <CategoryGrid />
      <FounderSection />
      <FeaturedBusinesses />
      <Testimonials />
      <JobsSection />
      <NewsletterSignup />
      <GetListedSection />
      <TrustBadge />
      <Footer />
    </div>
  );
};

export default Index;
