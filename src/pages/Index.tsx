import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryGrid from "@/components/CategoryGrid";
import FounderSection from "@/components/FounderSection";
import GetListedSection from "@/components/GetListedSection";
import TrustBadge from "@/components/TrustBadge";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CategoryGrid />
      <FounderSection />
      <GetListedSection />
      <TrustBadge />
    </div>
  );
};

export default Index;
