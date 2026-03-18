import { useState, useRef } from "react";
import { Image, Video, Send, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleFileSelect = (type: "image" | "video") => {
    setMediaType(type);
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === "image" ? "image/*" : "video/*";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaFile(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const clearMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handleSubmit = async () => {
    if (!content.trim() && !mediaFile) return;
    setPosting(true);

    let media_url: string | null = null;

    if (mediaFile) {
      const ext = mediaFile.name.split(".").pop();
      const path = `${user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, mediaFile);
      if (!error) {
        const { data } = supabase.storage.from("media").getPublicUrl(path);
        media_url = data.publicUrl;
      }
    }

    await supabase.from("posts").insert({
      user_id: user.id,
      content: content.trim() || null,
      media_url,
      media_type: mediaFile ? mediaType : null,
    });

    setContent("");
    clearMedia();
    setPosting(false);
    onPostCreated();
  };

  return (
    <div className="bg-card border rounded-xl p-4 shadow-card">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
          {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening in your neighborhood?"
            rows={3}
            className="w-full bg-muted/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
          <AnimatePresence>
            {mediaPreview && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative mt-2"
              >
                <button onClick={clearMedia} className="absolute top-2 right-2 bg-foreground/70 text-background rounded-full p-1 z-10">
                  <X size={14} />
                </button>
                {mediaType === "image" ? (
                  <img src={mediaPreview} alt="Preview" className="rounded-lg max-h-60 w-full object-cover" />
                ) : (
                  <video src={mediaPreview} controls className="rounded-lg max-h-60 w-full" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-1">
              <button
                onClick={() => handleFileSelect("image")}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Image size={18} />
              </button>
              <button
                onClick={() => handleFileSelect("video")}
                className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Video size={18} />
              </button>
            </div>
            <button
              onClick={handleSubmit}
              disabled={posting || (!content.trim() && !mediaFile)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {posting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              Post
            </button>
          </div>
        </div>
      </div>
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
    </div>
  );
};

export default CreatePost;
