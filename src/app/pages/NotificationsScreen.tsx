import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export function NotificationsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const notificationSettings = [
    { id: 1, title: t.dashboard.dailyGoals, enabled: true },
    { id: 2, title: t.workouts.title, enabled: true },
    { id: 3, title: t.meals.title, enabled: false },
    { id: 4, title: t.meditation.title, enabled: true },
    { id: 5, title: t.community.title, enabled: false }
  ];

  return (
    <MobileLayout showNav={false}>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 max-w-[430px] mx-auto bg-[var(--color-lightest)] z-10 px-6 pt-12 pb-4">
        <button onClick={() => navigate('/settings')} className="flex items-center gap-2 text-[var(--color-dark)] hover:text-[var(--color-darkest)]">
          <ChevronLeft size={20} />
          <span className="text-body1">{t.common.back}</span>
        </button>
      </div>

      <div className="px-6 pt-24 pb-24">

        <h4 className="mb-2">{t.settings.notifications}</h4>
        <p className="text-body2 text-[var(--color-mid-dark)] mb-6">
          {t.settings.subtitle}
        </p>

        <Card>
          <div className="divide-y divide-[var(--color-lighter)]">
            {notificationSettings.map((setting, index) => (
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
