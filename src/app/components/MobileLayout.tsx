/**
 * MobileLayout.tsx
 * ----------------
 * Shared shell for every post-authentication screen. Provides the mobile-width
 * frame (max 430px) and the fixed bottom navigation bar with 5 tabs.
 *
 * Contains:
 *   - <MobileLayout /> wrapping component
 *
 * Used by: Home, Tracker, Meals, Workout, Meditation, Analytics, Community,
 * Shop, Settings, Profile, Help, and the settings sub-screens.
 */

import { ReactNode } from 'react';
import { Home, Activity, Heart, Users, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface MobileLayoutProps {
  children: ReactNode;          // page content rendered inside the shell
  showNav?: boolean;            // when false, hides the bottom nav (default true)
}

/**
 * MobileLayout
 * ------------
 * Takes children and an optional showNav flag, returns the mobile-shaped
 * shell with bottom nav. Uses useLocation() to highlight the active tab and
 * useNavigate() to move between tabs. Pulls labels from the language context.
 */
export function MobileLayout({ children, showNav = true }: MobileLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Variables related to the bottom navigation tabs
  // Each entry: an icon component, a translated label, and a route path.
  const navItems = [
    { icon: Home, label: t.nav.home, path: '/home' },
    { icon: Activity, label: t.nav.fitness, path: '/tracker' },
    { icon: Heart, label: t.nav.meditation, path: '/meditation' },
    { icon: Users, label: t.nav.community, path: '/community' },
    { icon: Settings, label: t.nav.profile, path: '/settings' }
  ];

  return (
    <div className="min-h-screen flex flex-col w-full max-w-[500px] sm:max-w-[430px] mx-auto bg-[var(--color-lightest)]">
      {/* Main content area — pb-20 leaves space for the fixed nav bar */}
      <div className={`flex-1 overflow-y-auto ${showNav ? 'pb-20' : ''}`}>
        {children}
      </div>

      {/* Fixed bottom navigation, only rendered if showNav is true */}
      {showNav && (
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-[500px] sm:max-w-[430px] mx-auto bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-[var(--color-lighter)] px-4 py-3 safe-bottom">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 transition-colors"
                >
                  <Icon
                    size={24}
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
