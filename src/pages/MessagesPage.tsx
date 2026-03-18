import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SocialLayout from "@/layouts/SocialLayout";
import AuthModal from "@/components/AuthModal";
import { Send, MessageCircle, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const MessagesPage = () => {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvo, setActiveConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!activeConvo) return;
    fetchMessages();

    const channel = supabase
      .channel(`msgs-${activeConvo}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${activeConvo}` }, () => {
        fetchMessages();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeConvo]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    if (!user) return;
    const { data: parts } = await supabase
      .from("conversation_participants")
      .select("conversation_id")
      .eq("user_id", user.id);

    if (!parts?.length) { setLoading(false); return; }

    const ids = parts.map((p) => p.conversation_id);
    const { data } = await supabase
      .from("conversations")
      .select("id, updated_at")
      .in("id", ids)
      .order("updated_at", { ascending: false });

    if (data) setConversations(data);
    setLoading(false);
  };

  const fetchMessages = async () => {
    if (!activeConvo) return;
    const { data } = await supabase
      .from("messages")
      .select("id, content, created_at, sender_id, profiles:sender_id(display_name)")
      .eq("conversation_id", activeConvo)
      .order("created_at", { ascending: true });
    if (data) setMessages(data as any[]);
  };

  const sendMessage = async () => {
    if (!user || !activeConvo || !newMsg.trim()) return;
    await supabase.from("messages").insert({
      conversation_id: activeConvo,
      sender_id: user.id,
      content: newMsg.trim(),
    });
    setNewMsg("");
  };

  if (!user) {
    return (
      <SocialLayout>
        <div className="max-w-lg mx-auto p-4 text-center py-20">
          <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl font-serif font-bold text-foreground mb-2">Messages</h1>
          <p className="text-sm text-muted-foreground mb-4">Sign in to chat with your neighbors.</p>
          <button onClick={() => setShowAuth(true)} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
            Sign In
          </button>
          <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        </div>
      </SocialLayout>
    );
  }

  return (
    <SocialLayout>
      <div className="flex h-[calc(100vh-60px)] lg:h-screen max-w-4xl mx-auto">
        {/* Conversation list */}
        <div className={`w-full sm:w-80 border-r bg-card ${activeConvo ? "hidden sm:block" : ""}`}>
          <div className="p-4 border-b">
            <h1 className="text-lg font-serif font-bold text-foreground">Messages</h1>
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 size={20} className="animate-spin text-muted-foreground" /></div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-muted-foreground">No conversations yet. Find neighbors and start chatting!</p>
            </div>
          ) : (
            conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConvo(c.id)}
                className={`w-full p-4 text-left border-b hover:bg-muted transition-colors ${activeConvo === c.id ? "bg-muted" : ""}`}
              >
                <p className="text-sm font-medium text-foreground">Conversation</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(c.updated_at), { addSuffix: true })}
                </p>
              </button>
            ))
          )}
        </div>

        {/* Message area */}
        <div className={`flex-1 flex flex-col ${!activeConvo ? "hidden sm:flex" : ""}`}>
          {!activeConvo ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Select a conversation</p>
            </div>
          ) : (
            <>
              <div className="p-3 border-b flex items-center gap-2">
                <button onClick={() => setActiveConvo(null)} className="sm:hidden text-muted-foreground text-sm">← Back</button>
                <p className="text-sm font-semibold text-foreground">Chat</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                      m.sender_id === user.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}>
                      {m.sender_id !== user.id && (
                        <p className="text-xs font-semibold mb-0.5 opacity-70">{m.profiles?.display_name ?? "Neighbor"}</p>
                      )}
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="p-3 border-t flex gap-2">
                <input
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button onClick={sendMessage} className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </SocialLayout>
  );
};

export default MessagesPage;
