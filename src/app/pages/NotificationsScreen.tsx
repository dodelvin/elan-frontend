/**
 * NotificationsScreen.tsx
 * -----------------------
 * Notifications preferences. List of categories (Daily Goals / Workouts /
 * Meals / Meditation / Community), each with a toggle switch.
 *
 * Route: /notifications
 *
 * Note: the toggles currently have no onClick — Phase 4 will wire them to
 * PUT /api/users/me/notification-prefs.
 *
 * Contains:
 *   - <NotificationsScreen />
 */

import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * NotificationsScreen
 * -------------------
 * No props. Renders a static list — toggles are visual only for now.
 */
export function NotificationsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Variables related to the per-category notification toggles.
  // Default values reflect a sensible "wellness reminders on, social off" preset.
  const notificationSettings = [
    { id: 1, title: t.dashboard.dailyGoals, enabled: true  },
    { id: 2, title: t.workouts.title,       enabled: true  },
    { id: 3, title: t.meals.title,          enabled: false },
    { id: 4, title: t.meditation.title,     enabled: true  },
    { id: 5, title: t.community.title,      enabled: false }
  ];

  return (
    <MobileLayout showNav={false}>
      <div className="px-6 pt-12 pb-24">
        {/* Back button — bottom nav is hidden on this screen */}
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 mb-6 text-[var(--color-dark)] hover:text-[var(--color-darkest)]"
        >
          <ChevronLeft size={20} />
          <span className="text-body1">{t.common.back}</span>
        </button>

        <h4 className="mb-2">{t.settings.notifications}</h4>
        <p className="text-body2 text-[var(--color-mid-dark)] mb-6">
          {t.settings.subtitle}
        </p>

        {/* Toggle list */}
        <Card>
          <div className="divide-y divide-[var(--color-lighter)]">
            {notificationSettings.map((setting) => (
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
