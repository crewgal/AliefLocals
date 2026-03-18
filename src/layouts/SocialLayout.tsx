import { ReactNode } from "react";
import SocialSidebar from "@/components/social/SocialSidebar";
import MobileNav from "@/components/social/MobileNav";
import TopBar from "@/components/social/TopBar";

const SocialLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <SocialSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

export default SocialLayout;
