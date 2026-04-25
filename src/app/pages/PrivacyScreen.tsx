/**
 * PrivacyScreen.tsx
 * -----------------
 * Privacy preferences. Three toggle rows (profile visibility, analytics
 * sharing, community progress sharing).
 *
 * Route: /privacy
 *
 * Note: toggles are visual only. Phase 4 will wire them to
 * PUT /api/users/me/privacy.
 *
 * Contains:
 *   - <PrivacyScreen />
 */

import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * PrivacyScreen
 * -------------
 * No props. Renders a static toggle list — same shape as NotificationsScreen.
 */
export function PrivacyScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Variables related to the privacy toggles.
  // Default state mirrors typical wellness app defaults — share basics, hide raw analytics.
  const privacySettings = [
    { id: 1, title: t.profile.title,             enabled: true  },
    { id: 2, title: t.analytics.title,           enabled: false },
    { id: 3, title: t.community.shareProgress,   enabled: true  }
  ];

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

        <h4 className="mb-2">{t.settings.privacy}</h4>
        <p className="text-body2 text-[var(--color-mid-dark)] mb-6">
          {t.settings.subtitle}
        </p>

        {/* Toggle list */}
        <Card>
          <div className="divide-y divide-[var(--color-lighter)]">
            {privacySettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between py-4">
                <span className="text-body2">{setting.title}</span>
                <button
                  onClick={() => {}}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    setting.enabled ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-lighter)]'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-transform ${
                    setting.enabled ? 'left-6' : 'left-0.5'
                  }`}></div>
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MobileLayout>
  );
}
