import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SocialLayout from "@/layouts/SocialLayout";
import AuthModal from "@/components/AuthModal";
import { UserPlus, Check, Clock, MessageCircle, Loader2 } from "lucide-react";

const PeoplePage = () => {
  const { user } = useAuth();
  const [people, setPeople] = useState<any[]>([]);
  const [friendships, setFriendships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    fetchPeople();
    if (user) fetchFriendships();
  }, [user]);

  const fetchPeople = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, user_id, display_name, avatar_url, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setPeople(data.filter((p) => p.user_id !== user?.id));
    setLoading(false);
  };

  const fetchFriendships = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("friendships")
      .select("*")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);
    if (data) setFriendships(data);
  };

  const getFriendStatus = (userId: string) => {
    const f = friendships.find(
      (f) => (f.requester_id === user?.id && f.addressee_id === userId) || (f.addressee_id === user?.id && f.requester_id === userId)
    );
    return f?.status ?? null;
  };

  const sendRequest = async (addresseeId: string) => {
    if (!user) { setShowAuth(true); return; }
    await supabase.from("friendships").insert({ requester_id: user.id, addressee_id: addresseeId });
    fetchFriendships();
  };

  const acceptRequest = async (requesterId: string) => {
    if (!user) return;
    await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("requester_id", requesterId)
      .eq("addressee_id", user.id);
    fetchFriendships();
  };

  const startConversation = async (otherUserId: string) => {
    if (!user) return;
    // Create conversation + add both participants
    const { data: convo } = await supabase.from("conversations").insert({}).select().single();
    if (convo) {
      await supabase.from("conversation_participants").insert([
        { conversation_id: convo.id, user_id: user.id },
        { conversation_id: convo.id, user_id: otherUserId },
      ]);
      window.location.href = "/messages";
    }
  };

  const pendingRequests = friendships.filter((f) => f.addressee_id === user?.id && f.status === "pending");

  return (
    <SocialLayout>
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <h1 className="text-xl font-serif font-bold text-foreground">Find Neighbors</h1>

        {/* Pending requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground">Friend Requests</h2>
            {pendingRequests.map((req) => {
              const person = people.find((p) => p.user_id === req.requester_id);
              return (
                <div key={req.id} className="bg-card border rounded-xl p-4 flex items-center justify-between shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {(person?.display_name?.[0] ?? "?").toUpperCase()}
                    </div>
                    <p className="text-sm font-medium text-foreground">{person?.display_name ?? "Neighbor"}</p>
                  </div>
                  <button
                    onClick={() => acceptRequest(req.requester_id)}
                    className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                  >
                    Accept
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* All people */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : people.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-xl">
            <p className="text-muted-foreground text-sm">No neighbors have joined yet.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {people.map((p) => {
              const status = getFriendStatus(p.user_id);
              return (
                <div key={p.id} className="bg-card border rounded-xl p-4 flex items-center justify-between shadow-card">
                  <div className="flex items-center gap-3">
                    {p.avatar_url ? (
                      <img src={p.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
                        {(p.display_name?.[0] ?? "?").toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground">{p.display_name ?? "Neighbor"}</p>
                      <p className="text-xs text-muted-foreground">Alief neighbor</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {status === "accepted" ? (
                      <>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground px-3 py-2">
                          <Check size={14} /> Friends
                        </span>
                        <button
                          onClick={() => startConversation(p.user_id)}
                          className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <MessageCircle size={18} />
                        </button>
                      </>
                    ) : status === "pending" ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground px-3 py-2">
                        <Clock size={14} /> Pending
                      </span>
                    ) : (
                      <button
                        onClick={() => sendRequest(p.user_id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                      >
                        <UserPlus size={16} /> Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </SocialLayout>
  );
};

export default PeoplePage;
