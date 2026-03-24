import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import SocialLayout from "@/layouts/SocialLayout";
import AuthModal from "@/components/AuthModal";
import {
  Send,
  MessageCircle,
  Loader2,
  Video,
  Plus,
  Users,
  Search,
  ArrowLeft,
  Calendar,
  Link2,
  X,
  UserPlus,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import {
  listConversations,
  listMessages,
  sendMessage as createMessage,
  createConversation,
  listPeople,
  type Conversation,
  type Message,
  type Profile,
} from "@/lib/api";

const MessagesPage = () => {
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // New conversation state
  const [showNewChat, setShowNewChat] = useState(false);
  const [people, setPeople] = useState<Profile[]>([]);
  const [selectedPeople, setSelectedPeople] = useState<Profile[]>([]);
  const [peopleSearch, setPeopleSearch] = useState("");
  const [creatingConvo, setCreatingConvo] = useState(false);

  // Video/meetup link state
  const [showVideoMenu, setShowVideoMenu] = useState(false);
  const [showMeetupForm, setShowMeetupForm] = useState(false);
  const [meetupTitle, setMeetupTitle] = useState("");
  const [meetupDate, setMeetupDate] = useState("");
  const [meetupTime, setMeetupTime] = useState("");
  const [meetupLink, setMeetupLink] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!activeConvo) return;
    fetchMessages();
    const intervalId = window.setInterval(fetchMessages, 5000);
    return () => window.clearInterval(intervalId);
  }, [activeConvo]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    if (!user) return;
    const data = await listConversations();
    if (data) setConversations(data);
    setLoading(false);
  };

  const fetchMessages = async () => {
    if (!activeConvo) return;
    const data = await listMessages(activeConvo);
    if (data) setMessages(data);
  };

  const sendMessage = async () => {
    if (!user || !activeConvo || !newMsg.trim()) return;
    await createMessage(activeConvo, newMsg.trim());
    setNewMsg("");
    fetchMessages();
    fetchConversations();
  };

  const openNewChat = async () => {
    setShowNewChat(true);
    setSelectedPeople([]);
    setPeopleSearch("");
    try {
      const data = await listPeople();
      if (data) setPeople(data.filter((p) => p.user_id !== user?.id));
    } catch {
      setPeople([]);
    }
  };

  const togglePerson = (person: Profile) => {
    setSelectedPeople((prev) =>
      prev.find((p) => p.user_id === person.user_id)
        ? prev.filter((p) => p.user_id !== person.user_id)
        : [...prev, person]
    );
  };

  const startConversation = async () => {
    if (selectedPeople.length === 0 || creatingConvo) return;
    setCreatingConvo(true);
    try {
      const convo = await createConversation(selectedPeople.map((p) => p.user_id));
      if (convo) {
        setActiveConvo(convo.id);
        setShowNewChat(false);
        fetchConversations();
      }
    } catch {
      // handle error
    }
    setCreatingConvo(false);
  };

  const sendVideoLink = (platform: "zoom" | "meet") => {
    const placeholder =
      platform === "zoom"
        ? "https://zoom.us/j/your-meeting-id"
        : "https://meet.google.com/your-meeting-code";
    const link = prompt(`Paste your ${platform === "zoom" ? "Zoom" : "Google Meet"} link:`, placeholder);
    if (link && link.trim() && activeConvo) {
      const icon = platform === "zoom" ? "📹" : "🎥";
      createMessage(activeConvo, `${icon} Video Call: ${link.trim()}\nJoin the call now!`).then(() => {
        fetchMessages();
        fetchConversations();
      });
    }
    setShowVideoMenu(false);
  };

  const sendMeetup = () => {
    if (!meetupTitle.trim() || !meetupDate || !activeConvo) return;
    let msg = `📅 Meetup: ${meetupTitle.trim()}`;
    msg += `\n🗓 ${format(new Date(meetupDate), "EEEE, MMM d, yyyy")}`;
    if (meetupTime) msg += ` at ${meetupTime}`;
    if (meetupLink.trim()) msg += `\n🔗 ${meetupLink.trim()}`;
    msg += `\nEveryone's invited!`;

    createMessage(activeConvo, msg).then(() => {
      fetchMessages();
      fetchConversations();
    });
    setShowMeetupForm(false);
    setMeetupTitle("");
    setMeetupDate("");
    setMeetupTime("");
    setMeetupLink("");
  };

  const filteredPeople = people.filter(
    (p) =>
      !peopleSearch ||
      (p.display_name || "").toLowerCase().includes(peopleSearch.toLowerCase())
  );

  const isVideoLink = (content: string) =>
    content.includes("zoom.us/") || content.includes("meet.google.com/") || content.startsWith("📹") || content.startsWith("🎥");

  const isMeetup = (content: string) => content.startsWith("📅 Meetup:");

  if (!user) {
    return (
      <SocialLayout>
        <div className="max-w-lg mx-auto p-4 text-center py-20">
          <MessageCircle size={48} className="mx-auto text-muted-foreground mb-4" />
          <h1 className="text-xl font-serif font-bold text-foreground mb-2">Messages</h1>
          <p className="text-sm text-muted-foreground mb-4">Sign in to chat with your neighbors and local businesses.</p>
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
      <div className="flex h-[calc(100vh-60px)] lg:h-screen max-w-5xl mx-auto border-x">
        {/* ─── Left: Conversation list ─── */}
        <div className={`w-full sm:w-80 border-r bg-card flex flex-col ${activeConvo ? "hidden sm:flex" : ""}`}>
          <div className="p-4 border-b flex items-center justify-between">
            <h1 className="text-lg font-serif font-bold text-foreground">Messages</h1>
            <button
              onClick={openNewChat}
              className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              title="New conversation"
            >
              <Plus size={18} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={20} className="animate-spin text-muted-foreground" />
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageCircle size={28} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">No conversations yet</p>
              <p className="text-xs text-muted-foreground mb-4">Start chatting with neighbors or businesses</p>
              <button
                onClick={openNewChat}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Start a Chat
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              {conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConvo(c.id)}
                  className={`w-full p-4 text-left border-b hover:bg-muted/50 transition-colors flex items-center gap-3 ${
                    activeConvo === c.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users size={16} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">Conversation</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(c.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Right: Chat area ─── */}
        <div className={`flex-1 flex flex-col bg-background ${!activeConvo && !showNewChat ? "hidden sm:flex" : ""}`}>
          {showNewChat ? (
            /* ── New conversation creator ── */
            <div className="flex flex-col h-full">
              <div className="p-4 border-b flex items-center gap-3">
                <button onClick={() => setShowNewChat(false)} className="p-1 text-muted-foreground hover:text-foreground">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-sm font-semibold text-foreground">New Conversation</h2>
              </div>

              <div className="p-4 border-b">
                <div className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2">
                  <Search size={16} className="text-muted-foreground" />
                  <input
                    value={peopleSearch}
                    onChange={(e) => setPeopleSearch(e.target.value)}
                    placeholder="Search people..."
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </div>

                {selectedPeople.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedPeople.map((p) => (
                      <span
                        key={p.user_id}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        {p.display_name || "User"}
                        <button onClick={() => togglePerson(p)}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredPeople.map((person) => {
                  const selected = selectedPeople.some((p) => p.user_id === person.user_id);
                  return (
                    <button
                      key={person.user_id}
                      onClick={() => togglePerson(person)}
                      className={`w-full p-4 flex items-center gap-3 border-b hover:bg-muted/50 transition-colors ${
                        selected ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {person.avatar_url ? (
                          <img src={person.avatar_url} className="w-10 h-10 rounded-full object-cover" alt="" />
                        ) : (
                          <UserPlus size={16} className="text-primary" />
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground flex-1 text-left">
                        {person.display_name || "Neighbor"}
                      </p>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selected ? "bg-primary border-primary" : "border-muted-foreground/30"
                        }`}
                      >
                        {selected && <span className="text-primary-foreground text-xs">✓</span>}
                      </div>
                    </button>
                  );
                })}
                {filteredPeople.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-12">No people found</p>
                )}
              </div>

              <div className="p-4 border-t">
                <button
                  onClick={startConversation}
                  disabled={selectedPeople.length === 0 || creatingConvo}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
                >
                  {creatingConvo ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />}
                  {selectedPeople.length > 1 ? "Start Group Chat" : "Start Chat"}
                </button>
              </div>
            </div>
          ) : !activeConvo ? (
            /* ── Empty state ── */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <MessageCircle size={36} className="text-primary" />
              </div>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-2">Your Messages</h2>
              <p className="text-sm text-muted-foreground max-w-xs mb-6">
                Chat 1-on-1 or in groups. Share video call links and schedule meetups with neighbors and businesses.
              </p>
              <button
                onClick={openNewChat}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Start a Conversation
              </button>
            </div>
          ) : (
            /* ── Active chat ── */
            <>
              <div className="p-3 border-b flex items-center justify-between bg-card">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveConvo(null)} className="sm:hidden p-1 text-muted-foreground">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users size={14} className="text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Chat</p>
                </div>

                <div className="flex items-center gap-1 relative">
                  <button
                    onClick={() => setShowVideoMenu(!showVideoMenu)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Video call"
                  >
                    <Video size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setShowMeetupForm(!showMeetupForm);
                      setShowVideoMenu(false);
                    }}
                    className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title="Schedule meetup"
                  >
                    <Calendar size={18} />
                  </button>

                  {/* Video menu dropdown */}
                  {showVideoMenu && (
                    <div className="absolute right-0 top-full mt-1 w-52 bg-card border rounded-xl shadow-elevated z-10 overflow-hidden">
                      <button
                        onClick={() => sendVideoLink("zoom")}
                        className="w-full p-3 text-left text-sm font-medium text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                      >
                        📹 Share Zoom Link
                      </button>
                      <button
                        onClick={() => sendVideoLink("meet")}
                        className="w-full p-3 text-left text-sm font-medium text-foreground hover:bg-muted flex items-center gap-2 border-t transition-colors"
                      >
                        🎥 Share Google Meet Link
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Meetup form */}
              {showMeetupForm && (
                <div className="p-4 border-b bg-primary/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Calendar size={16} className="text-primary" /> Schedule a Meetup
                    </p>
                    <button onClick={() => setShowMeetupForm(false)} className="text-muted-foreground hover:text-foreground">
                      <X size={16} />
                    </button>
                  </div>
                  <input
                    value={meetupTitle}
                    onChange={(e) => setMeetupTitle(e.target.value)}
                    placeholder="Meetup title (e.g. Coffee at Starbucks)"
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={meetupDate}
                      onChange={(e) => setMeetupDate(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <input
                      type="time"
                      value={meetupTime}
                      onChange={(e) => setMeetupTime(e.target.value)}
                      className="w-32 px-3 py-2 rounded-lg border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <input
                    value={meetupLink}
                    onChange={(e) => setMeetupLink(e.target.value)}
                    placeholder="Video call link (optional)"
                    className="w-full px-3 py-2 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={sendMeetup}
                    disabled={!meetupTitle.trim() || !meetupDate}
                    className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
                  >
                    Send Meetup Invite
                  </button>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <p className="text-center text-xs text-muted-foreground py-8">No messages yet. Say hello! 👋</p>
                )}
                {messages.map((m) => {
                  const isMine = m.sender_id === user.id;
                  const isVideo = isVideoLink(m.content);
                  const isMeetupMsg = isMeetup(m.content);

                  return (
                    <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl text-sm ${
                          isVideo || isMeetupMsg
                            ? "border bg-card p-4 shadow-sm"
                            : isMine
                            ? "bg-primary text-primary-foreground px-4 py-2.5"
                            : "bg-muted text-foreground px-4 py-2.5"
                        }`}
                      >
                        {!isMine && (
                          <p className="text-xs font-semibold mb-1 opacity-70">
                            {m.profiles?.display_name ?? "Neighbor"}
                          </p>
                        )}

                        {isVideo ? (
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Video size={18} className="text-primary" />
                              <span className="font-semibold text-foreground">Video Call</span>
                            </div>
                            {m.content.split("\n").map((line, i) => {
                              const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
                              if (urlMatch) {
                                return (
                                  <a
                                    key={i}
                                    href={urlMatch[1]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity mt-1"
                                  >
                                    <Link2 size={14} />
                                    Join Call
                                  </a>
                                );
                              }
                              return (
                                <p key={i} className="text-xs text-muted-foreground">
                                  {line}
                                </p>
                              );
                            })}
                          </div>
                        ) : isMeetupMsg ? (
                          <div>
                            {m.content.split("\n").map((line, i) => (
                              <p
                                key={i}
                                className={`${
                                  i === 0
                                    ? "font-semibold text-foreground text-base"
                                    : line.startsWith("🔗")
                                    ? "text-primary underline text-xs mt-1"
                                    : "text-sm text-muted-foreground"
                                }`}
                              >
                                {line.startsWith("🔗") ? (
                                  <a href={line.replace("🔗 ", "")} target="_blank" rel="noopener noreferrer">
                                    {line}
                                  </a>
                                ) : (
                                  line
                                )}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <span className="whitespace-pre-wrap">{m.content}</span>
                        )}

                        <p className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                          {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Message input */}
              <div className="p-3 border-t bg-card flex gap-2">
                <input
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMsg.trim()}
                  className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
                >
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
