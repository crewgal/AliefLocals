import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SocialLayout from "@/layouts/SocialLayout";
import CreatePost from "@/components/social/CreatePost";
import PostCard from "@/components/social/PostCard";
import RightSidebar from "@/components/social/RightSidebar";
import AuthModal from "@/components/AuthModal";
import { Loader2, Users, MessageCircle, ImagePlus, Video, Home } from "lucide-react";
import { listPosts, type Post } from "@/lib/api";

const FeedPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      setPosts(await listPosts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchPosts();

    const intervalId = window.setInterval(fetchPosts, 15000);
    return () => window.clearInterval(intervalId);
  }, [user]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  // Gate: require login
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-4 py-2 rounded-full">
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
        <div className="max-w-md w-full bg-card border rounded-2xl p-8 text-center shadow-lg space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Users size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Welcome to Alief Community
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sign in to connect with your neighbors, share photos &amp; videos, chat with friends and family, and join local groups.
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
              <ImagePlus size={16} className="text-primary" />
              <span>Share Photos</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
              <Video size={16} className="text-primary" />
              <span>Post Videos</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
              <MessageCircle size={16} className="text-primary" />
              <span>Chat &amp; Message</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
              <Users size={16} className="text-primary" />
              <span>Join Groups</span>
            </div>
          </div>
          <button
            onClick={() => setShowAuth(true)}
            className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Sign In to Join
          </button>
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <button onClick={() => setShowAuth(true)} className="text-primary font-medium hover:underline">
              Sign up free
            </button>
          </p>
        </div>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    );
  }

  return (
    <SocialLayout>
      <div className="flex max-w-6xl mx-auto">
        <div className="flex-1 max-w-2xl mx-auto p-4 space-y-4">
          <CreatePost onPostCreated={fetchPosts} />

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
    </SocialLayout>
  );
};

export default FeedPage;
