import { Facebook, Instagram, Youtube } from "lucide-react";

const socialLinks = [
  { name: "Facebook", icon: Facebook, url: "https://facebook.com/alieflocals", color: "hover:bg-blue-600 hover:text-white" },
  { name: "Instagram", icon: Instagram, url: "https://instagram.com/alieflocals", color: "hover:bg-pink-600 hover:text-white" },
  { name: "YouTube", icon: Youtube, url: "https://youtube.com/@alieflocals", color: "hover:bg-red-600 hover:text-white" },
  { name: "TikTok", icon: null, url: "https://tiktok.com/@alieflocals", color: "hover:bg-foreground hover:text-white" },
];

// Simple TikTok icon since lucide doesn't have one
const TikTokIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.56a8.24 8.24 0 0 0 4.76 1.51V6.69h-1z" />
  </svg>
);

interface SocialMediaLinksProps {
  variant?: "light" | "dark" | "colored";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SocialMediaLinks = ({ variant = "colored", size = "md", className = "" }: SocialMediaLinksProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = { sm: 14, md: 18, lg: 22 };

  const baseClasses = {
    light: "bg-white/10 text-white/70",
    dark: "bg-muted text-muted-foreground",
    colored: "bg-muted text-muted-foreground",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${sizeClasses[size]} rounded-full ${baseClasses[variant]} ${link.color} flex items-center justify-center transition-all duration-200`}
          aria-label={link.name}
        >
          {link.icon ? (
            <link.icon size={iconSizes[size]} />
          ) : (
            <TikTokIcon size={iconSizes[size]} />
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialMediaLinks;
