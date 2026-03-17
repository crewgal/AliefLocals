import { MapPin, Users, ShieldCheck } from "lucide-react";

const badges = [
  { icon: MapPin, label: "77083", sub: "Alief, TX" },
  { icon: Users, label: "Community First", sub: "Local & Vetted" },
  { icon: ShieldCheck, label: "Invitation Only", sub: "Quality Assured" },
];

const TrustBadge = () => {
  return (
    <section className="py-12 px-6 border-t">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Alief Locals · Harris County, TX 77083
        </p>
        <div className="flex items-center gap-8">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.label} className="flex items-center gap-2">
                <Icon size={16} className="text-primary" strokeWidth={1.5} />
                <div>
                  <p className="text-xs font-semibold text-foreground">{b.label}</p>
                  <p className="text-[10px] text-muted-foreground">{b.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadge;
