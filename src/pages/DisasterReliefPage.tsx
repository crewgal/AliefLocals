import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  AlertTriangle, Droplets, Home, Package, Heart, Phone, MapPin,
  Shield, Users, Truck, ArrowRight, ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const emergencyContacts = [
  { name: "911 Emergency", phone: "911", desc: "Police, Fire, EMS" },
  { name: "Harris County Emergency", phone: "713-881-3100", desc: "County emergency management" },
  { name: "Red Cross Houston", phone: "713-526-8300", desc: "Disaster shelter & assistance" },
  { name: "FEMA Helpline", phone: "1-800-621-3362", desc: "Federal disaster assistance" },
  { name: "National Weather Service", phone: "281-337-5074", desc: "Weather alerts & warnings" },
  { name: "Texas 211", phone: "211", desc: "Community resources & referrals" },
];

const supplyNeeds = [
  { icon: Droplets, name: "Water & Hydration", items: "Bottled water, electrolytes, water purification tablets" },
  { icon: Package, name: "Non-Perishable Food", items: "Canned goods, granola bars, baby formula, pet food" },
  { icon: Home, name: "Shelter Supplies", items: "Tarps, blankets, sleeping bags, air mattresses" },
  { icon: Heart, name: "Medical & Hygiene", items: "First aid kits, medications, diapers, feminine products" },
  { icon: Shield, name: "Safety Equipment", items: "Flashlights, batteries, generators, gas cans" },
  { icon: Truck, name: "Cleanup Supplies", items: "Trash bags, gloves, bleach, mops, shovels" },
];

const shelterLocations = [
  { name: "Alief Community Center", address: "11903 Bellaire Blvd, Houston, TX 77072", status: "Open during emergencies" },
  { name: "Alief ISD Taylor High School", address: "20700 Kingsland Blvd, Katy, TX 77450", status: "Designated shelter" },
  { name: "Mission Bend Branch Library", address: "8421 Addicks-Clodine Rd, Houston, TX 77083", status: "Community resource hub" },
];

const DisasterReliefPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="bg-destructive/10 border-b border-destructive/20 py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-destructive/15 text-destructive px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <AlertTriangle size={16} /> Community Emergency Resources
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
              Alief Disaster Relief Center
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              When disaster strikes our community, Alief comes together. Find emergency contacts,
              supply needs, shelter locations, and ways to help your neighbors.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
            <Phone size={22} className="text-destructive" /> Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {emergencyContacts.map((contact) => (
              <motion.a
                key={contact.name}
                href={`tel:${contact.phone.replace(/-/g, "")}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card border rounded-xl p-4 hover:border-destructive/30 hover:shadow-md transition-all flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{contact.name}</h3>
                  <p className="text-primary font-bold text-lg">{contact.phone}</p>
                  <p className="text-xs text-muted-foreground">{contact.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Supply Needs */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground mb-2 flex items-center gap-2">
            <Package size={22} className="text-primary" /> What's Needed During a Disaster
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            These are the most commonly needed supplies during hurricanes, floods, and other natural disasters in the Houston area.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {supplyNeeds.map((supply) => {
              const Icon = supply.icon;
              return (
                <motion.div
                  key={supply.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-card border rounded-xl p-5"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{supply.name}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{supply.items}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shelter Locations */}
      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground mb-6 flex items-center gap-2">
            <MapPin size={22} className="text-primary" /> Shelter & Resource Locations
          </h2>
          <div className="space-y-3">
            {shelterLocations.map((shelter) => (
              <motion.div
                key={shelter.name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{shelter.name}</h3>
                  <p className="text-xs text-muted-foreground">{shelter.address}</p>
                </div>
                <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full self-start sm:self-center">
                  {shelter.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Help */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 bg-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Users size={32} className="mx-auto mb-4 text-primary" />
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-white mb-3">
              How You Can Help
            </h2>
            <p className="text-white/60 max-w-xl mx-auto mb-8 text-sm sm:text-base">
              Whether you can volunteer time, donate supplies, or provide shelter — every bit of help matters.
              Our community is strongest when we look out for each other.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/community"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Post on Community Board <ArrowRight size={16} />
              </Link>
              <a
                href="https://www.redcross.org/donate"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                Donate to Red Cross <ExternalLink size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Preparedness Tips */}
      <section className="py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-foreground mb-6 text-center">
            Be Prepared — Before Disaster Strikes
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Build an Emergency Kit", desc: "Keep 3 days of water, food, meds, flashlights, and important documents in a go-bag." },
              { title: "Know Your Evacuation Route", desc: "Harris County has designated routes. Know yours and have a family meeting point." },
              { title: "Secure Your Home", desc: "Board windows, move valuables high, and turn off gas if flooding is expected." },
              { title: "Stay Connected", desc: "Follow Alief Locals community board, local news, and register for emergency alerts at readyharris.org." },
            ].map((tip, i) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border rounded-xl p-5"
              >
                <h3 className="font-semibold text-foreground text-sm mb-2">{tip.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DisasterReliefPage;
