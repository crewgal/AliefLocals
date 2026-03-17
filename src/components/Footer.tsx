import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, Mail, MapPin } from "lucide-react";
import logo from "@/assets/alief-locals-logo.png";

const categories = [
  { name: "Restaurants", slug: "restaurants" },
  { name: "Mechanics", slug: "mechanics" },
  { name: "Dentists", slug: "dentists" },
  { name: "Car Insurance", slug: "car-insurance" },
  { name: "Barber Shops", slug: "barber-shops" },
  { name: "Churches", slug: "churches" },
  { name: "Car Dealerships", slug: "car-dealerships" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-white/70 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="font-serif text-2xl font-semibold text-white tracking-tight">
              Alief <span className="text-primary">Locals</span>
            </Link>
            <p className="text-sm mt-3 leading-relaxed text-white/50">
              Connecting the Alief community with trusted, local businesses since day one.
              Free listings. Invitation only. Real neighbors.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-colors" aria-label="Facebook">
                <Facebook size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-colors" aria-label="Instagram">
                <Instagram size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-primary/80 flex items-center justify-center transition-colors" aria-label="YouTube">
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/get-listed" className="text-sm hover:text-white transition-colors">Get Listed</Link></li>
              <li>
                <a
                  href="https://calendly.com/thesthillstudios/sthill-studios-website-design-marketing-and-seo-meeting"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors"
                >
                  Book a Meeting
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary/70" />
                Alief, Houston, TX 77083
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Mail size={15} className="mt-0.5 shrink-0 text-primary/70" />
                hello@alieflocals.com
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Alief Locals. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Built with ❤️ for the Alief community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
