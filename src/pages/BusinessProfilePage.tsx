import { useState, useEffect } from "react";
import SocialLayout from "@/layouts/SocialLayout";
import ReviewSection from "@/components/ReviewSection";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Globe, CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getBusinessBySlug } from "@/lib/api";
import SocialMediaLinks from "@/components/SocialMediaLinks";

// Fallback sample data for businesses not yet in the DB
const sampleBusiness = {
  id: "",
  name: "Infinity Coordinator",
  category: "Event Planning",
  slug: "infinity-coordinator",
  phone: "(843) 364-8057",
  website: "https://example.com",
  verified: true,
  image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop",
  description:
    "After a successful 25+ year career in the motion picture industry as a Production and Travel Coordinator on films in production at distant filming locations, a career I'm proud of and one in which I value the travel and wisdom gained, the desire to help people on a more personalized basis in achieving their travel dreams and adventures took priority in life.",
};

const BusinessProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [biz, setBiz] = useState(sampleBusiness);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (!slug) return;
      const data = await getBusinessBySlug(slug).catch(() => null);

      if (data) {
        setBiz({
          id: data.id,
          name: data.name,
          category: data.category,
          slug: data.slug,
          phone: data.phone ?? "",
          website: data.website ?? "",
          verified: data.verified ?? false,
          image_url: data.image_url ?? sampleBusiness.image_url,
          description: data.description ?? "",
        });
      }
      setLoading(false);
    };
    fetchBusiness();
  }, [slug]);

  return (
    <SocialLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Businesses
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-8">
            {biz.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Left column — Photo + Bio */}
            <div className="md:col-span-3 space-y-6">
              <div className="rounded-xl overflow-hidden border bg-card shadow-card">
                <img
                  src={biz.image_url}
                  alt={biz.name}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              {biz.description && (
                <div className="space-y-4">
                  {biz.description.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed text-sm">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Right column — Contact + Reviews */}
            <div className="md:col-span-2 space-y-8">
              {/* Contact Info */}
              <div className="bg-card border rounded-xl p-6 shadow-card space-y-5">
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  Contact Info
                </h2>

                {biz.phone && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Phone size={16} className="text-primary shrink-0" />
                    <a href={`tel:${biz.phone}`} className="hover:text-foreground transition-colors">
                      {biz.phone}
                    </a>
                  </div>
                )}

                {biz.website && (
                  <a
                    href={biz.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    <Globe size={16} />
                    Website
                  </a>
                )}

                {biz.verified && (
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <CheckCircle size={18} />
                    Verified
                  </div>
                )}
              </div>

              {/* Reviews — from database */}
              {biz.id ? (
                <ReviewSection businessId={biz.id} />
              ) : (
                <div className="bg-card border rounded-xl p-6 shadow-card">
                  <p className="text-sm text-muted-foreground text-center">
                    Reviews will be available once this business is in our directory.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </SocialLayout>
  );
};

export default BusinessProfilePage;
