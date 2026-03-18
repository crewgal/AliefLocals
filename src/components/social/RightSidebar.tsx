import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus } from "lucide-react";
import AuthModal from "@/components/AuthModal";

const RightSidebar = () => {
  const { user } = useAuth();
  const [people, setPeople] = useState<any[]>([]);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const fetchPeople = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, user_id, display_name, avatar_url")
        .limit(6);
      if (data) setPeople(data.filter((p) => p.user_id !== user?.id));
    };
    fetchPeople();
  }, [user]);

  const sendFriendRequest = async (addresseeId: string) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    await supabase.from("friendships").insert({
      requester_id: user.id,
      addressee_id: addresseeId,
    });
  };

  return (
    <aside className="hidden xl:block w-72 h-screen sticky top-0 p-4 space-y-6">
      <div className="bg-card border rounded-xl p-4 shadow-card">
        <h3 className="text-sm font-serif font-semibold text-foreground mb-3">People Nearby</h3>
        <div className="space-y-3">
          {people.slice(0, 5).map((p) => (
            <div key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {p.avatar_url ? (
                  <img src={p.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-xs">
                    {(p.display_name?.[0] ?? "?").toUpperCase()}
                  </div>
                )}
                <p className="text-sm text-foreground truncate max-w-[120px]">{p.display_name ?? "Neighbor"}</p>
              </div>
              <button
                onClick={() => sendFriendRequest(p.user_id)}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                title="Add friend"
              >
                <UserPlus size={16} />
              </button>
            </div>
          ))}
          {people.length === 0 && (
            <p className="text-xs text-muted-foreground">No neighbors yet. Be the first to join!</p>
          )}
        </div>
      </div>

      <div className="bg-card border rounded-xl p-4 shadow-card">
        <h3 className="text-sm font-serif font-semibold text-foreground mb-2">Community</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Connect with your Alief neighbors. Share what's happening, find local businesses, and build community together.
        </p>
      </div>

      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </aside>
  );
};

export default RightSidebar;
