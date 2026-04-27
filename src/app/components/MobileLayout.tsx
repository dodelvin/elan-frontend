/**
 * MobileLayout.tsx
 * ----------------
 * Shared shell for every post-authentication screen. Provides the mobile-width
 * frame and the fixed bottom navigation bar with 5 tabs.
 *
 * Tab labels: Home, Goals (was Fitness), Meditation, Community, Profile.
 */

import { ReactNode } from 'react';
import { Home, Target, Heart, Users, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface MobileLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export function MobileLayout({ children, showNav = true }: MobileLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Bottom nav tabs. The second tab routes to /goals (was previously /tracker
  // and labelled Fitness).
  const navItems = [
    { icon: Home,     label: t.nav.home,        path: '/home'       },
    { icon: Target,   label: t.nav.goals,       path: '/goals'      },
    { icon: Heart,    label: t.nav.meditation,  path: '/meditation' },
    { icon: Users,    label: t.nav.community,   path: '/community'  },
    { icon: Settings, label: t.nav.profile,     path: '/settings'   }
  ];

  return (
    <div className="min-h-screen flex flex-col w-full max-w-[500px] sm:max-w-[430px] mx-auto bg-[var(--color-lightest)]">
      <div className={`flex-1 overflow-y-auto ${showNav ? 'pb-20' : ''}`}>
        {children}
      </div>

      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-[500px] sm:max-w-[430px] mx-auto bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-[var(--color-lighter)] px-4 py-2 safe-bottom">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-0.5 transition-colors active:scale-90"
                >
                  <Icon
                    size={22}
                    className={isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-mid-dark)]'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span className={`text-caption ${isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-mid-dark)]'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
