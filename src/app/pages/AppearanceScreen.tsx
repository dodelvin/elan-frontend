/**
 * AppearanceScreen.tsx
 * --------------------
 * Theme picker. Currently shows two buttons (Light / Dark) with Light
 * pre-selected. Static for now — toggles do not actually switch the theme.
 *
 * Route: /appearance
 *
 * Note: dark-mode wiring lives in Phase 4 alongside the rest of the user
 * preferences.
 *
 * Contains:
 *   - <AppearanceScreen />
 */

import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * AppearanceScreen
 * ----------------
 * No props. Static UI for now.
 */
export function AppearanceScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <MobileLayout showNav={false}>
      <div className="px-6 pt-12 pb-24">
        {/* Back button — bottom nav hidden */}
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 mb-6 text-[var(--color-dark)] hover:text-[var(--color-darkest)]"
        >
          <ChevronLeft size={20} />
          <span className="text-body1">{t.common.back}</span>
        </button>

        <h4 className="mb-2">{t.settings.appearance}</h4>
        <p className="text-body2 text-[var(--color-mid-dark)] mb-6">
          {t.settings.subtitle}
        </p>

        {/* Light / Dark mode picker — Light is the active option */}
        <Card>
          <div className="space-y-4">
            <div>
              <h6 className="mb-3">{t.settings.darkMode}</h6>
              <div className="flex gap-3">
                <button className="flex-1 p-4 rounded-xl bg-[var(--color-primary)] text-white">
                  Light
                </button>
                <button className="flex-1 p-4 rounded-xl bg-[var(--color-lighter)] text-[var(--color-dark)]">
                  Dark
                </button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </MobileLayout>
  );
}
