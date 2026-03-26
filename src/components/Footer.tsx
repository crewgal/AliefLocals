import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";
import logo from "@/assets/alief-locals-logo.png";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-white/70 pt-10 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 mb-8 sm:mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/"><img src={logo} alt="Alief Locals" className="h-10 sm:h-14" /></Link>
            <p className="text-xs sm:text-sm mt-3 leading-relaxed text-white/50">
              {t("Connecting the Alief community with trusted, local businesses since day one.")}
            </p>
            <SocialMediaLinks variant="light" size="sm" className="mt-4 sm:mt-5" />
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs sm:text-sm mb-3 sm:mb-4">{t("Categories")}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link to={`/category/${cat.slug}`} className="text-xs sm:text-sm hover:text-white transition-colors">
                    {t(cat.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs sm:text-sm mb-3 sm:mb-4">{t("Quick Links")}</h4>
            <ul className="space-y-1.5 sm:space-y-2">
              <li><Link to="/get-listed" className="text-xs sm:text-sm hover:text-white transition-colors">{t("Get Listed")}</Link></li>
              <li><Link to="/founding-sponsors" className="text-xs sm:text-sm hover:text-white transition-colors">{t("Founding Sponsors")}</Link></li>
              <li><Link to="/disaster-relief" className="text-xs sm:text-sm hover:text-white transition-colors">{t("Disaster Relief")}</Link></li>
              <li>
                <a href="https://calendly.com/thesthillstudios/sthill-studios-website-design-marketing-and-seo-meeting" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm hover:text-white transition-colors">
                  {t("Book a Meeting")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs sm:text-sm mb-3 sm:mb-4">{t("Contact")}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-start gap-2 text-xs sm:text-sm">
                <MapPin size={14} className="mt-0.5 shrink-0 text-primary/70" />
                Alief, Houston, TX 77083
              </li>
              <li className="flex items-start gap-2 text-xs sm:text-sm">
                <Mail size={14} className="mt-0.5 shrink-0 text-primary/70" />
                hello@alieflocals.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 sm:pt-6 flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="text-[10px] sm:text-xs text-white/30">
            © {new Date().getFullYear()} Alief Locals. {t("All rights reserved.")}
          </p>
          <p className="text-[10px] sm:text-xs text-white/30">
            {t("Built with ❤️ for the Alief community")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
