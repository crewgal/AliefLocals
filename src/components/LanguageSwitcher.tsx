import { useState, useRef, useEffect } from "react";
import { Globe, Loader2 } from "lucide-react";
import { useLanguage, languages } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage, isTranslating } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = languages.find((l) => l.code === language);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-primary/10 text-sm font-medium text-primary transition-colors border border-primary/30"
        title="Change language"
      >
        {isTranslating ? (
          <Loader2 size={16} className="animate-spin text-primary" />
        ) : (
          <Globe size={16} className="text-primary" />
        )}
        <span>{current?.flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm hover:bg-primary/10 transition-colors ${
                language === lang.code ? "text-primary font-semibold" : "text-foreground"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
