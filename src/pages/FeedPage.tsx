import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SocialLayout from "@/layouts/SocialLayout";
import CreatePost from "@/components/social/CreatePost";
import PostCard from "@/components/social/PostCard";
import RightSidebar from "@/components/social/RightSidebar";
import AuthModal from "@/components/AuthModal";
import { Loader2 } from "lucide-react";

const FeedPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("posts")
      .select("id, user_id, content, media_url, media_type, created_at, profiles:user_id(display_name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setPosts(data as any[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();

    // Realtime subscription
    const channel = supabase
      .channel("feed-posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <SocialLayout>
      <div className="flex max-w-6xl mx-auto">
        <div className="flex-1 max-w-2xl mx-auto p-4 space-y-4">
          {/* Welcome / Auth prompt */}
          {!user && (
            <div className="bg-card border rounded-xl p-6 text-center shadow-card">
              <h1 className="text-xl font-serif font-bold text-foreground mb-2">Welcome to Alief Locals</h1>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with your neighbors, discover local businesses, and share what's happening in your community.
              </p>
              <button
                onClick={() => setShowAuth(true)}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Join the Community
              </button>
            </div>
          )}

          {user && <CreatePost onPostCreated={fetchPosts} />}

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-sm">No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onDeleted={fetchPosts} />
            ))
          )}
        </div>
        <RightSidebar />
      </div>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </SocialLayout>
  );
};

export default FeedPage;
