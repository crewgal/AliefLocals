import { useState, useRef, useEffect } from "react";
import { Globe, Loader2 } from "lucide-react";
import { useLanguage, languages } from "@/contexts/LanguageContext";

const langColors: Record<string, string> = {
  en: "bg-primary text-primary-foreground",
  es: "bg-[hsl(0,72%,50%)] text-white",
  fr: "bg-[hsl(220,70%,45%)] text-white",
  zh: "bg-[hsl(15,80%,48%)] text-white",
  ar: "bg-[hsl(145,60%,38%)] text-white",
  hi: "bg-[hsl(25,90%,50%)] text-white",
  pt: "bg-[hsl(130,55%,35%)] text-white",
  ko: "bg-[hsl(350,65%,48%)] text-white",
};

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

  // Set data-lang on mount for persisted language
  useEffect(() => {
    if (language !== "en") {
      document.documentElement.setAttribute("data-lang", language);
    }
  }, []);

  const current = languages.find((l) => l.code === language);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${langColors[language] || langColors.en}`}
        title="Change language"
      >
        {isTranslating ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Globe size={16} />
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
