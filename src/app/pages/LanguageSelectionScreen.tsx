/**
 * LanguageSelectionScreen.tsx
 * ---------------------------
 * Language picker. Lists Azerbaijani / English / Russian with flag, native
 * name, and English name. Tapping a row updates the LanguageContext (which
 * persists to localStorage) and navigates back to /settings.
 *
 * Route: /language
 *
 * Contains:
 *   - <LanguageSelectionScreen />
 *   - handleLanguageChange()  swap language and bounce back to settings
 */

import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

// One language option in the picker — keep code typed to match the context.
type LanguageOption = {
  code: 'az' | 'en' | 'ru';
  name: string;          // English name
  nativeName: string;    // self-name (shown larger)
  flag: string;          // emoji flag
};

/**
 * LanguageSelectionScreen
 * -----------------------
 * No props. Reads `language` and `setLanguage` from the language context
 * to highlight the active option and switch on tap.
 */
export function LanguageSelectionScreen() {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Variables related to the language picker rows.
  const languages: LanguageOption[] = [
    { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycanca', flag: '🇦🇿' },
    { code: 'en', name: 'English',     nativeName: 'English',      flag: '🇬🇧' },
    { code: 'ru', name: 'Russian',     nativeName: 'Русский',      flag: '🇷🇺' }
  ];

  /**
   * handleLanguageChange
   * Takes a language code, calls setLanguage() (which persists to
   * localStorage), then navigates back to /settings after a 300 ms delay
   * so the user briefly sees the check-mark move.
   */
  const handleLanguageChange = (langCode: 'az' | 'en' | 'ru') => {
    setLanguage(langCode);
    setTimeout(() => {
      navigate('/settings');
    }, 300);
  };

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        <h4 className="mb-2">{t.settings.language}</h4>
        <p className="text-body2 text-[var(--color-mid-dark)] mb-6">
          {t.settings.selectLanguage}
        </p>

        {/* Language list — active option shows a green check */}
        <Card className="divide-y divide-[var(--color-lighter)]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="w-full flex items-center justify-between py-4 px-1 hover:bg-[var(--color-lightest)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{lang.flag}</span>
                <div className="flex flex-col items-start">
                  <span className="text-body2 font-medium">{lang.nativeName}</span>
                  <span className="text-caption text-[var(--color-mid-dark)]">{lang.name}</span>
                </div>
              </div>
              {language === lang.code && (
                <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </Card>
      </div>
    </MobileLayout>
  );
}
