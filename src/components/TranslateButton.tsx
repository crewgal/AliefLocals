import { useState } from "react";
import { Globe, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const languages = [
  { code: "es", label: "Español", flag: "🇲🇽" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

interface TranslateButtonProps {
  text: string;
  onTranslated: (translated: string | null) => void;
}

const TranslateButton = ({ text, onTranslated }: TranslateButtonProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState<string | null>(null);

  const handleTranslate = async (langCode: string) => {
    if (langCode === activeLang) {
      // Toggle off — show original
      setActiveLang(null);
      onTranslated(null);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: { text, targetLang: langCode },
      });
      if (error) throw error;
      onTranslated(data.translated);
      setActiveLang(langCode);
    } catch {
      // Silently fail — keep original text
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 text-xs font-medium transition-colors ${
          activeLang
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Translate"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
        {activeLang && (
          <>
            <span>{languages.find((l) => l.code === activeLang)?.flag}</span>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveLang(null); onTranslated(null); }}
              className="ml-0.5 hover:text-destructive"
            >
              <X size={10} />
            </button>
          </>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-6 z-20 bg-card border rounded-lg shadow-elevated py-1 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleTranslate(lang.code)}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-muted transition-colors ${
                activeLang === lang.code ? "text-primary font-medium" : "text-foreground"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TranslateButton;
