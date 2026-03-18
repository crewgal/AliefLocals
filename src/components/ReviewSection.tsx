import { useState, useEffect } from "react";
import { Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";
import { motion } from "framer-motion";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | null;
}

interface ReviewSectionProps {
  businessId: string;
}

const ReviewSection = ({ businessId }: ReviewSectionProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, profiles(display_name, avatar_url)")
      .eq("business_id", businessId)
      .order("created_at", { ascending: false });

    if (data) setReviews(data as unknown as Review[]);
    setLoading(false);
  };

  useEffect(() => {
    if (businessId) fetchReviews();
  }, [businessId]);

  const handleWriteReview = () => {
    if (!user) {
      setShowAuth(true);
    } else {
      setShowForm(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmed = comment.trim();
    if (!trimmed || trimmed.length > 2000) {
      setError("Review must be between 1 and 2000 characters.");
      return;
    }

    setSubmitting(true);
    setError("");

    const { error: insertError } = await supabase.from("reviews").insert({
      business_id: businessId,
      user_id: user.id,
      rating,
      comment: trimmed,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        setError("You've already reviewed this business.");
      } else {
        setError(insertError.message);
      }
    } else {
      setComment("");
      setRating(5);
      setShowForm(false);
      await fetchReviews();
    }
    setSubmitting(false);
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="bg-card border rounded-xl p-6 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-serif font-semibold text-foreground">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>
        {avgRating && (
          <div className="flex items-center gap-1 text-sm font-medium text-foreground">
            <Star size={14} className="fill-primary text-primary" />
            {avgRating}
          </div>
        )}
      </div>

      {/* Write review button */}
      {!showForm && (
        <button
          onClick={handleWriteReview}
          className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Write a Review
        </button>
      )}

      {/* Review form */}
      {showForm && user && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleSubmit}
          className="space-y-3 border-t pt-4"
        >
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  size={24}
                  className={
                    star <= (hoverRating || rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground"
                  }
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            required
            maxLength={2000}
            rows={4}
            className="w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError(""); }}
              className="px-4 py-3 rounded-xl border text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Review list */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 size={20} className="animate-spin text-muted-foreground" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No reviews yet. Be the first!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="space-y-2 border-t pt-4 first:border-0 first:pt-0">
              <div className="flex items-center gap-1">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-primary text-primary" />
                ))}
                {Array.from({ length: 5 - review.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-muted-foreground" />
                ))}
              </div>
              <p className="text-sm font-semibold text-foreground">
                {review.profiles?.display_name ?? "Anonymous"}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <AuthModal open={showAuth} onClose={() => { setShowAuth(false); if (user) setShowForm(true); }} />
    </div>
  );
};

export default ReviewSection;
