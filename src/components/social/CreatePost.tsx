import { useState, useRef } from "react";
import { Image, Video, Send, X, Loader2, CalendarDays, Users, Briefcase, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { createPost, uploadMedia } from "@/lib/api";

interface CreatePostProps {
  onPostCreated: () => void;
}

const categories = [
  { icon: Image, label: "Photo", color: "bg-green-100 text-green-700 border-green-200" },
  { icon: Video, label: "Video", color: "bg-red-100 text-red-700 border-red-200" },
  { icon: CalendarDays, label: "Event", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { icon: Users, label: "Meetup", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { icon: Briefcase, label: "Job", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { icon: Plus, label: "RSVP", color: "bg-teal-100 text-teal-700 border-teal-200" },
];

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [posting, setPosting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const handleCategoryClick = (label: string) => {
    setActiveCategory(activeCategory === label ? null : label);
    if (label === "Photo") handleFileSelect("image");
    else if (label === "Video") handleFileSelect("video");
  };

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
      const upload = await uploadMedia(mediaFile);
      media_url = upload.url;
    }

    await createPost({
      content: content.trim() || null,
      mediaUrl: media_url,
      mediaType: mediaFile ? mediaType : null,
    });

    setContent("");
    clearMedia();
    setActiveCategory(null);
    setPosting(false);
    onPostCreated();
  };

  return (
    <div className="bg-card border rounded-xl p-4 shadow-card space-y-3">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
          {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
        </div>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening in Alief?"
          className="flex-1 bg-muted/50 rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 pl-[52px]">
        {categories.map(({ icon: Icon, label, color }) => (
          <button
            key={label}
            onClick={() => handleCategoryClick(label)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              activeCategory === label ? color : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {mediaPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative ml-[52px]"
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

      {(content.trim() || mediaFile) && (
        <div className="flex justify-end pl-[52px]">
          <button
            onClick={handleSubmit}
            disabled={posting}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {posting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Post
          </button>
        </div>
      )}

      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
    </div>
  );
};

export default CreatePost;
