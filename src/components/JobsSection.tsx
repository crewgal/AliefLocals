import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, DollarSign, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const sampleJobs = [
  {
    id: 1,
    title: "Line Cook",
    company: "Crawfish Café",
    location: "Alief, TX",
    type: "Full-time",
    salary: "$15–$20/hr",
    posted: "2 days ago",
  },
  {
    id: 2,
    title: "Front Desk Receptionist",
    company: "Alief Family Dental",
    location: "Alief, TX",
    type: "Full-time",
    salary: "$14–$18/hr",
    posted: "3 days ago",
  },
  {
    id: 3,
    title: "Auto Mechanic",
    company: "QuickFix Auto Repair",
    location: "Mission Bend, TX",
    type: "Full-time",
    salary: "$22–$30/hr",
    posted: "1 day ago",
  },
];

const JobsSection = () => {
  return (
    <section className="py-12 sm:py-20 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            Local Jobs
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
            Jobs in Your Neighborhood
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Find opportunities from local businesses right here in Alief and surrounding areas.
          </p>
        </motion.div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-8 sm:mb-10">
          {sampleJobs.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-card rounded-xl border p-4 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase size={16} className="text-primary" />
                </div>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{job.posted}</span>
              </div>
              <h3 className="font-semibold text-foreground text-base sm:text-lg mb-1">{job.title}</h3>
              <p className="text-xs sm:text-sm text-primary font-medium mb-2 sm:mb-3">{job.company}</p>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin size={10} /> {job.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock size={10} /> {job.type}
                </span>
                <span className="inline-flex items-center gap-1">
                  <DollarSign size={10} /> {job.salary}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-accent text-accent-foreground font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
          >
            View All Jobs <ArrowRight size={16} />
          </Link>
          <Link
            to="/post-job"
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-opacity text-sm"
          >
            Post a Job — Starting at $29
          </Link>
        </div>
      </div>
    </section>
  );
};

export default JobsSection;
