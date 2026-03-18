import SocialLayout from "@/layouts/SocialLayout";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, DollarSign, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const allJobs = [
  { id: 1, title: "Line Cook", company: "Crawfish Café", location: "Alief, TX", type: "Full-time", salary: "$15–$20/hr", posted: "2 days ago", category: "Restaurant" },
  { id: 2, title: "Front Desk Receptionist", company: "Alief Family Dental", location: "Alief, TX", type: "Full-time", salary: "$14–$18/hr", posted: "3 days ago", category: "Healthcare" },
  { id: 3, title: "Auto Mechanic", company: "QuickFix Auto Repair", location: "Mission Bend, TX", type: "Full-time", salary: "$22–$30/hr", posted: "1 day ago", category: "Automotive" },
  { id: 4, title: "Barber / Stylist", company: "Fresh Kutz", location: "Alief, TX", type: "Part-time", salary: "$12–$25/hr + tips", posted: "4 days ago", category: "Beauty" },
  { id: 5, title: "Cashier", company: "Alief Grocery Mart", location: "Alief, TX", type: "Part-time", salary: "$12–$14/hr", posted: "5 days ago", category: "Retail" },
  { id: 6, title: "Office Manager", company: "Southwest Insurance Group", location: "Alief, TX", type: "Full-time", salary: "$40k–$50k/yr", posted: "1 day ago", category: "Insurance" },
  { id: 7, title: "Delivery Driver", company: "Alief Eats", location: "Alief, TX", type: "Flexible", salary: "$15–$22/hr", posted: "6 hours ago", category: "Restaurant" },
  { id: 8, title: "Teacher Assistant", company: "Alief ISD", location: "Alief, TX", type: "Full-time", salary: "$28k–$32k/yr", posted: "3 days ago", category: "Education" },
];

const categories = ["All", "Restaurant", "Healthcare", "Automotive", "Beauty", "Retail", "Insurance", "Education"];

const JobsPage = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = allJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filter === "All" || job.category === filter;
    return matchesSearch && matchesCategory;
  });

  return (
    <SocialLayout>
      <div className="max-w-3xl mx-auto p-4">

      {/* Header */}
      <section className="bg-accent/5 border-b py-14">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3"
          >
            Local Jobs in Alief & Surrounding Areas
          </motion.h1>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Browse opportunities from businesses in your neighborhood.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs or companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </section>

      {/* Filters & Listings */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filter === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No jobs found matching your search.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-card rounded-xl border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Briefcase size={20} className="text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">{job.posted}</span>
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-0.5">{job.title}</h3>
                <p className="text-sm text-primary font-medium mb-3">{job.company}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                  <span className="inline-flex items-center gap-1"><Clock size={12} /> {job.type}</span>
                  <span className="inline-flex items-center gap-1"><DollarSign size={12} /> {job.salary}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-14 p-10 bg-muted/50 rounded-2xl border">
          <h3 className="font-serif text-2xl font-bold text-foreground mb-2">Hiring locally?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Reach thousands of job seekers in the Alief community. Post your open position today.
          </p>
          <Link
            to="/post-job"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity"
          >
            Post a Job — Starting at $29
          </Link>
        </div>
      </section>
      </div>
    </SocialLayout>
  );
};

export default JobsPage;
