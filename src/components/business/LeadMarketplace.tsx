import { useState } from "react";
import { MapPin, MessageSquare, Phone, DollarSign, ArrowRight, Briefcase, Video, Calendar, X, Link2, Users } from "lucide-react";
import { Link } from "react-router-dom";

const leads = [
  { title: "Electrical repair needed", person: "Sarah L.", time: "5 mins ago", area: "Neighborhood", price: "$6 - $10" },
  { title: "Call no answer for AC repair", person: "Mike R.", time: "2h ago", area: "Neighborhood", price: "" },
  { title: "Plumbing issue", person: "Ali P.", time: "0h in Alief", area: "Neighborhood", price: "$6 - $10" },
  { title: "Landscaping", person: "Carla H.", time: "1 hr ago", area: "Neighborhood", price: "$5 - $10" },
];

const jobs = [
  { title: "Landscaper", company: "GreenLeaf Landscaping", pay: "$18/hr", type: "Full Time", applicants: 9 },
  { title: "Restaurant Server", company: "Alief Kitchen Grill", pay: "$15/hr", type: "Part Time", applicants: 3 },
];

const nearby = [
  { name: "Sarah L.", time: "7 min" },
  { name: "Mike R.", time: "2m" },
  { name: "John D.", time: "2m" },
  { name: "Mark Taylor", time: "6h" },
  { name: "Lynda G.", time: "1m" },
];

interface Meetup {
  id: number;
  title: string;
  date: string;
  time: string;
  link: string;
  type: "video" | "in-person";
}

const LeadMarketplace = () => {
  const [showMeetupForm, setShowMeetupForm] = useState(false);
  const [meetupTitle, setMeetupTitle] = useState("");
  const [meetupDate, setMeetupDate] = useState("");
  const [meetupTime, setMeetupTime] = useState("");
  const [meetupLink, setMeetupLink] = useState("");
  const [meetupType, setMeetupType] = useState<"video" | "in-person">("video");
  const [meetups, setMeetups] = useState<Meetup[]>([
    { id: 1, title: "Alief Business Network Meetup", date: "2026-04-02", time: "10:00", link: "https://zoom.us/j/example", type: "video" },
    { id: 2, title: "Coffee & Connections", date: "2026-04-05", time: "14:00", link: "", type: "in-person" },
  ]);

  const addMeetup = () => {
    if (!meetupTitle.trim() || !meetupDate) return;
    setMeetups((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: meetupTitle.trim(),
        date: meetupDate,
        time: meetupTime,
        link: meetupLink.trim(),
        type: meetupType,
      },
    ]);
    setMeetupTitle("");
    setMeetupDate("");
    setMeetupTime("");
    setMeetupLink("");
    setShowMeetupForm(false);
  };

  return (
    <div className="flex-1 min-w-0 space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity">
          <Phone size={16} /> Find Customer Leads
        </button>
        <Link
          to="/post-job"
          className="flex items-center gap-2 px-5 py-2.5 border rounded-lg font-semibold text-sm text-foreground hover:bg-muted transition-colors"
        >
          <Briefcase size={16} /> Post a Job ($25) <ArrowRight size={14} />
        </Link>
        <button
          onClick={() => setShowMeetupForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 border border-primary/30 bg-primary/5 rounded-lg font-semibold text-sm text-primary hover:bg-primary/10 transition-colors"
        >
          <Video size={16} /> Schedule Meetup
        </button>
        <div className="flex items-center gap-2 px-5 py-2.5 border rounded-lg text-sm text-muted-foreground">
          <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">TBD</span>
          Increases time soon
        </div>
      </div>

      {/* Meetup Form */}
      {showMeetupForm && (
        <div className="bg-card border rounded-xl p-5 space-y-4 shadow-card">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-primary" /> Schedule a Business Meetup
            </h3>
            <button onClick={() => setShowMeetupForm(false)} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setMeetupType("video")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                meetupType === "video" ? "bg-primary text-primary-foreground border-primary" : "text-foreground hover:bg-muted"
              }`}
            >
              <Video size={16} /> Video Call
            </button>
            <button
              onClick={() => setMeetupType("in-person")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                meetupType === "in-person" ? "bg-primary text-primary-foreground border-primary" : "text-foreground hover:bg-muted"
              }`}
            >
              <Users size={16} /> In-Person
            </button>
          </div>

          <input
            value={meetupTitle}
            onChange={(e) => setMeetupTitle(e.target.value)}
            placeholder="Meetup title (e.g. Alief Business Networking)"
            className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex gap-3">
            <input
              type="date"
              value={meetupDate}
              onChange={(e) => setMeetupDate(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="time"
              value={meetupTime}
              onChange={(e) => setMeetupTime(e.target.value)}
              className="w-36 px-4 py-2.5 rounded-lg border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <input
            value={meetupLink}
            onChange={(e) => setMeetupLink(e.target.value)}
            placeholder={meetupType === "video" ? "Zoom or Google Meet link" : "Location address (optional)"}
            className="w-full px-4 py-2.5 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={addMeetup}
            disabled={!meetupTitle.trim() || !meetupDate}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            Create Meetup
          </button>
        </div>
      )}

      {/* Upcoming Meetups */}
      {meetups.length > 0 && (
        <div>
          <h2 className="text-lg font-serif font-semibold text-foreground mb-3">Upcoming Meetups</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {meetups.map((m) => (
              <div key={m.id} className="bg-card border rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.type === "video" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}>
                    {m.type === "video" ? <Video size={18} /> : <Users size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{m.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(m.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      {m.time && ` at ${m.time}`}
                    </p>
                    <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      m.type === "video" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                    }`}>
                      {m.type === "video" ? "Video Call" : "In-Person"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-1">
                  {m.link && m.type === "video" && (
                    <a
                      href={m.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Link2 size={12} /> Join Call
                    </a>
                  )}
                  {m.link && m.type === "in-person" && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin size={12} /> {m.link}
                    </span>
                  )}
                  <Link
                    to="/messages"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <MessageSquare size={12} /> Chat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Marketplace */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <h2 className="text-lg font-serif font-semibold text-foreground">Lead Marketplace</h2>
          <button className="text-xs text-primary font-medium hover:underline">More Filters ▾</button>
        </div>

        <div className="flex">
          {/* Leads list */}
          <div className="flex-1 divide-y">
            {leads.map((lead) => (
              <div key={lead.title} className="flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-xs">
                    {lead.person[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{lead.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.person} · {lead.time}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                      <MapPin size={10} /> {lead.area}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {lead.price && (
                    <span className="text-xs text-muted-foreground">{lead.price}</span>
                  )}
                  <button className="px-4 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity">
                    Claim Lead
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Location sidebar */}
          <div className="hidden md:block w-56 border-l p-4 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Location</p>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <MapPin size={14} className="text-primary" />
                <span>5 min · Neighborhood</span>
              </div>
            </div>
            <div className="space-y-2">
              {nearby.map((p) => (
                <div key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-foreground">
                      {p.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">Posted · Alief</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{p.time}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-2 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors">
              Upgrade Listing →
            </button>
          </div>
        </div>
      </div>

      {/* Job Postings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-serif font-semibold text-foreground">Job Postings</h2>
          <Link to="/jobs" className="text-xs text-primary hover:underline">See All →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.title} className="bg-card border rounded-xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Briefcase size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                  <p className="text-xs text-muted-foreground">{job.pay} · {job.type}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{job.applicants} applicants</p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors">
                  Stop
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors">
                  Review Applicants <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadMarketplace;
