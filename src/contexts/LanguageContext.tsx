import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SupportedLang = "en" | "es" | "fr" | "zh" | "ar" | "hi" | "pt" | "ko";

export const languages = [
  { code: "en" as const, label: "English", flag: "🇺🇸" },
  { code: "es" as const, label: "Español", flag: "🇲🇽" },
  { code: "fr" as const, label: "Français", flag: "🇫🇷" },
  { code: "zh" as const, label: "中文", flag: "🇨🇳" },
  { code: "ar" as const, label: "العربية", flag: "🇸🇦" },
  { code: "hi" as const, label: "हिन्दी", flag: "🇮🇳" },
  { code: "pt" as const, label: "Português", flag: "🇧🇷" },
  { code: "ko" as const, label: "한국어", flag: "🇰🇷" },
];

interface LanguageContextType {
  language: SupportedLang;
  setLanguage: (lang: SupportedLang) => void;
  t: (text: string) => string;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (text) => text,
  isTranslating: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<SupportedLang>(
    () => (localStorage.getItem("site-lang") as SupportedLang) || "en"
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const cache = useRef<Map<string, string>>(new Map());
  const [, forceUpdate] = useState(0);

  const translateBatch = useCallback(async (texts: string[], lang: SupportedLang) => {
    if (lang === "en" || !supabase) return;
    const untranslated = texts.filter((t) => !cache.current.has(`${lang}:${t}`));
    if (untranslated.length === 0) return;

    setIsTranslating(true);
    try {
      // Translate in chunks to avoid hitting size limits
      const chunks: string[][] = [];
      for (let i = 0; i < untranslated.length; i += 5) {
        chunks.push(untranslated.slice(i, i + 5));
      }
      for (const chunk of chunks) {
        const combined = chunk.join("\n---SPLIT---\n");
        const { data, error } = await supabase.functions.invoke("translate", {
          body: { text: combined, targetLang: lang },
        });
        if (!error && data?.translated) {
          const parts = data.translated.split(/\n?---SPLIT---\n?/);
          chunk.forEach((original, i) => {
            cache.current.set(`${lang}:${original}`, parts[i]?.trim() || original);
          });
        }
      }
    } catch {
      // silently fail
    } finally {
      setIsTranslating(false);
      forceUpdate((n) => n + 1);
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLang) => {
    setLanguageState(lang);
    localStorage.setItem("site-lang", lang);
    // Apply language-specific theme
    if (lang === "en") {
      document.documentElement.removeAttribute("data-lang");
    } else {
      document.documentElement.setAttribute("data-lang", lang);
    }
    forceUpdate((n) => n + 1);
  }, []);

  const t = useCallback(
    (text: string): string => {
      if (language === "en" || !text) return text;
      const key = `${language}:${text}`;
      const cached = cache.current.get(key);
      if (cached) return cached;
      // Queue translation
      translateBatch([text], language);
      return text; // Return original until translated
    },
    [language, translateBatch]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
};
