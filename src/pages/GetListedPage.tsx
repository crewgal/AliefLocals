import SocialLayout from "@/layouts/SocialLayout";
import GetListedSection from "@/components/GetListedSection";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const GetListedPage = () => {
  return (
    <SocialLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link
          to="/businesses"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to Businesses
        </Link>
        <GetListedSection />
      </div>
    </SocialLayout>
  );
};

export default GetListedPage;
