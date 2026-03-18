import { useState, useEffect } from "react";
import { Heart, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: {
    id: string;
    user_id: string;
    content: string | null;
    media_url: string | null;
    media_type: string | null;
    created_at: string;
    profiles: { display_name: string | null; avatar_url: string | null } | null;
  };
  onDeleted?: () => void;
}

const PostCard = ({ post, onDeleted }: PostCardProps) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    fetchLikes();
  }, [post.id]);

  const fetchLikes = async () => {
    const { count } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post.id);
    setLikes(count ?? 0);

    if (user) {
      const { data } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", post.id)
        .eq("user_id", user.id)
        .maybeSingle();
      setLiked(!!data);
    }
  };

  const toggleLike = async () => {
    if (!user) return;
    if (liked) {
      await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", user.id);
    } else {
      await supabase.from("likes").insert({ post_id: post.id, user_id: user.id });
    }
    setLiked(!liked);
    setLikes((p) => (liked ? p - 1 : p + 1));
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("id, content, created_at, user_id, profiles:user_id(display_name, avatar_url)")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });
    if (data) setComments(data as any[]);
  };

  const handleToggleComments = () => {
    if (!showComments) fetchComments();
    setShowComments(!showComments);
  };

  const submitComment = async () => {
    if (!user || !commentText.trim()) return;
    await supabase.from("comments").insert({
      post_id: post.id,
      user_id: user.id,
      content: commentText.trim(),
    });
    setCommentText("");
    fetchComments();
  };

  const deletePost = async () => {
    await supabase.from("posts").delete().eq("id", post.id);
    onDeleted?.();
  };

  const displayName = post.profiles?.display_name ?? "Neighbor";
  const initial = displayName[0]?.toUpperCase() ?? "?";
  const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });

  return (
    <div className="bg-card border rounded-xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {post.profiles?.avatar_url ? (
            <img src={post.profiles.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {initial}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground">{timeAgo}</p>
          </div>
        </div>
        {user?.id === post.user_id && (
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded-lg hover:bg-muted text-muted-foreground">
              <MoreHorizontal size={18} />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-8 bg-card border rounded-lg shadow-elevated z-10 py-1 min-w-[120px]">
                <button onClick={deletePost} className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted w-full">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {post.content && <p className="px-4 pb-3 text-sm text-foreground leading-relaxed">{post.content}</p>}

      {/* Media */}
      {post.media_url && (
        <div className="border-t border-b">
          {post.media_type === "video" ? (
            <video src={post.media_url} controls className="w-full max-h-[500px] object-contain bg-foreground/5" />
          ) : (
            <img src={post.media_url} alt="" className="w-full max-h-[500px] object-contain bg-foreground/5" />
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-2 flex items-center gap-4 border-b">
        <button onClick={toggleLike} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${liked ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <Heart size={18} className={liked ? "fill-primary" : ""} />
          {likes > 0 && likes}
        </button>
        <button onClick={handleToggleComments} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <MessageCircle size={18} />
          Comment
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="p-4 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground shrink-0">
                {(c.profiles?.display_name?.[0] ?? "?").toUpperCase()}
              </div>
              <div className="bg-muted rounded-xl px-3 py-2 flex-1">
                <p className="text-xs font-semibold text-foreground">{c.profiles?.display_name ?? "Neighbor"}</p>
                <p className="text-sm text-foreground">{c.content}</p>
              </div>
            </div>
          ))}
          {user && (
            <div className="flex gap-2 mt-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitComment()}
                placeholder="Write a comment..."
                className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
