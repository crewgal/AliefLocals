import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Globe, CheckCircle, Star, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Placeholder data — will be replaced with DB data later
const sampleBusiness = {
  name: "Infinity Coordinator",
  category: "Event Planning",
  slug: "infinity-coordinator",
  phone: "(843) 364-8057",
  website: "https://example.com",
  verified: true,
  image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&h=600&fit=crop",
  bio: [
    "After a successful 25+ year career in the motion picture industry as a Production and Travel Coordinator on films in production at distant filming locations, a career I'm proud of and one in which I value the travel and wisdom gained, the desire to help people on a more personalized basis in achieving their travel dreams and adventures took priority in life. To help create life experiences for others is truly rewarding.",
    "Heading down roads less traveled, as I have, brings people to life, teaches, inspires, and fills the heart. For me, it's a personal interest that I love sharing, and watching my clients living it along with them is almost as if I were there.",
  ],
  reviews: [
    {
      author: "Lynsay Williams",
      rating: 5,
      text: "We hired Gabrielle to coordinate our wedding and she was wonderful to work with! We were particular about what we wanted and she delivered on every detail. The day of our wedding was actually incredibly smooth and relaxing for us because we had her managing everything. Several of our friends and family commented on how professional and organized she was. I would highly recommend.",
    },
  ],
};

const BusinessProfilePage = () => {
  const { slug } = useParams<{ slug: string }>();
  // In the future, fetch business by slug. For now, use sample data.
  const biz = sampleBusiness;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-12">
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
          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-8">
            {biz.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Left column — Photo + Bio */}
            <div className="md:col-span-3 space-y-6">
              <div className="rounded-xl overflow-hidden border bg-card shadow-card">
                <img
                  src={biz.image}
                  alt={biz.name}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              <div className="space-y-4">
                {biz.bio.map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed text-sm">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Right column — Contact + Reviews */}
            <div className="md:col-span-2 space-y-8">
              {/* Contact Info */}
              <div className="bg-card border rounded-xl p-6 shadow-card space-y-5">
                <h2 className="text-lg font-serif font-semibold text-foreground">
                  Contact Info
                </h2>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone size={16} className="text-primary shrink-0" />
                  <a href={`tel:${biz.phone}`} className="hover:text-foreground transition-colors">
                    {biz.phone}
                  </a>
                </div>

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
                  <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                    <CheckCircle size={18} />
                    Verified
                  </div>
                )}
              </div>

              {/* Reviews */}
              {biz.reviews.length > 0 && (
                <div className="bg-card border rounded-xl p-6 shadow-card space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-serif font-bold text-foreground">G</span>
                    <h2 className="text-lg font-serif font-semibold text-foreground">
                      Reviews
                    </h2>
                  </div>

                  {biz.reviews.map((review, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, j) => (
                          <Star key={j} size={16} className="fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {review.author}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.text}
                      </p>
                    </div>
                  ))}

                  <a
                    href="#"
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg bg-accent text-accent-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  >
                    Google Reviews
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default BusinessProfilePage;
