import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import FounderSection from "@/components/FounderSection";
import FeaturedBusinesses from "@/components/FeaturedBusinesses";
import GetListedSection from "@/components/GetListedSection";
import TrustBadge from "@/components/TrustBadge";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoryGrid />
      <FounderSection />
      <FeaturedBusinesses />
      <GetListedSection />
      <TrustBadge />
    </div>
  );
};

export default Index;
