import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import SocialLayout from "@/layouts/SocialLayout";
import AuthModal from "@/components/AuthModal";
import { Users, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const GroupsPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const { data } = await supabase
      .from("groups")
      .select("*, group_members(count)")
      .eq("is_public", true)
      .order("created_at", { ascending: false });
    if (data) setGroups(data);
    setLoading(false);
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setShowAuth(true); return; }
    if (!name.trim()) return;

    setCreating(true);
    const { data: group } = await supabase
      .from("groups")
      .insert({ name: name.trim(), description: description.trim() || null, created_by: user.id })
      .select()
      .single();

    if (group) {
      await supabase.from("group_members").insert({ group_id: group.id, user_id: user.id, role: "admin" });
    }

    setName("");
    setDescription("");
    setShowCreate(false);
    setCreating(false);
    fetchGroups();
  };

  const joinGroup = async (groupId: string) => {
    if (!user) { setShowAuth(true); return; }
    await supabase.from("group_members").insert({ group_id: groupId, user_id: user.id });
    fetchGroups();
  };

  return (
    <SocialLayout>
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-serif font-bold text-foreground">Community Groups</h1>
          <button
            onClick={() => user ? setShowCreate(!showCreate) : setShowAuth(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={16} /> Create Group
          </button>
        </div>

        {showCreate && (
          <form onSubmit={handleCreateGroup} className="bg-card border rounded-xl p-4 shadow-card space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Group name"
              required
              className="w-full bg-muted/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this group about?"
              rows={2}
              className="w-full bg-muted/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create Group"}
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 rounded-xl border text-sm text-muted-foreground">
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-xl">
            <Users size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">No groups yet. Create the first one!</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {groups.map((g) => (
              <div key={g.id} className="bg-card border rounded-xl p-4 shadow-card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <Users size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{g.name}</p>
                    {g.description && <p className="text-xs text-muted-foreground line-clamp-1">{g.description}</p>}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {g.group_members?.[0]?.count ?? 0} members
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => joinGroup(g.id)}
                  className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors"
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
    </SocialLayout>
  );
};

export default GroupsPage;
