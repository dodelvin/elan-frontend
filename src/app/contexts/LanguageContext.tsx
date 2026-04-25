/**
 * LanguageContext.tsx
 * -------------------
 * App-wide internationalisation (i18n) provider. Exposes the current language,
 * a setter, and a `t` object holding all UI strings for the active language.
 * Three languages are supported: Azerbaijani (default), English, Russian.
 *
 * The chosen language is persisted in localStorage under the key
 * 'elan-language' so it survives reloads.
 *
 * Contains:
 *   - <LanguageProvider /> wrap-the-app provider
 *   - useLanguage()        hook for screens to read t / change language
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations';

// Variables related to types
type Language = 'az' | 'en' | 'ru';

interface LanguageContextType {
  language: Language;                       // currently active language code
  setLanguage: (lang: Language) => void;    // switch language and persist it
  t: typeof translations.az;                // strings for the active language
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * LanguageProvider
 * ----------------
 * Takes children, returns the provider wrapping them.
 * On mount, reads localStorage to restore any previously chosen language.
 * Default is Azerbaijani ('az').
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('az');

  // Load persisted language once on mount.
  useEffect(() => {
    const savedLanguage = localStorage.getItem('elan-language') as Language;
    if (savedLanguage && ['az', 'en', 'ru'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  /**
   * setLanguage
   * Takes a language code, updates state and writes to localStorage so the
   * choice persists across reloads.
   */
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('elan-language', lang);
  };

  // Active translation bundle — refreshed whenever `language` changes.
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * useLanguage
 * -----------
 * Hook used by every screen to read translations and change the language.
 * Returns { language, setLanguage, t }. Throws if called outside of
 * <LanguageProvider /> to prevent silent bugs.
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
