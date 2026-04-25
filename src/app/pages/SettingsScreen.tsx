/**
 * SettingsScreen.tsx
 * ------------------
 * Settings hub. Header shows the user's profile card. Body groups options
 * into three sections (Account, Preferences, Support). Tapping an item
 * navigates to a sub-screen, except Sign Out which opens a confirm dialog.
 *
 * Route: /settings
 *
 * Phase 4 update: Sign-out now calls AuthContext.signOut() which clears
 * the Firebase session, then redirects to /welcome. The user header is
 * also driven from the live Firebase user instead of being hardcoded.
 *
 * Contains:
 *   - <SettingsScreen />
 *   - getLanguageDisplay()  resolves the active language code to its label
 *   - handleSignOut()       runs the Firebase sign-out + redirect
 */

import { useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { ChevronRight, User, Bell, Lock, Palette, HelpCircle, LogOut, Moon, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';

// Variables related to types — describe the shape of one settings row and one section.
type SettingsItem = {
  icon: any;            // lucide icon component
  label: string;        // visible text
  path: string;         // route to navigate to, or 'sign-out' for the dialog
  subtitle?: string;    // optional secondary line (e.g. current language)
  toggle?: boolean;     // when true, render a switch instead of a chevron
  danger?: boolean;     // red colour for destructive items (sign out)
};

type SettingsSection = {
  title: string;
  items: SettingsItem[];
};

/**
 * SettingsScreen
 * --------------
 * No props. Reads the live Firebase user from AuthContext to render the
 * profile card. Sign-out is wired through to Firebase Auth.
 */
export function SettingsScreen() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, signOut } = useAuth();
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Variables related to the displayed user info
  // Falls back to placeholders if the user object is somehow missing.
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const displayEmail = user?.email || '';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  /**
   * getLanguageDisplay
   * No arguments. Returns the localized label for the currently active
   * language code (az / en / ru) — used as the subtitle of the Language row.
   */
  const getLanguageDisplay = () => {
    const languageMap: Record<string, string> = {
      az: t.settings.azerbaijani,
      en: t.settings.english,
      ru: t.settings.russian
    };
    return languageMap[language];
  };

  /**
   * handleSignOut
   * No arguments. Calls AuthContext.signOut() (which clears Firebase
   * session) then navigates to /welcome. ProtectedRoute would also
   * redirect on its own, but explicit navigation makes the UX snappy.
   */
  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate('/welcome', { replace: true });
    } catch (err) {
      console.error('Sign-out failed:', err);
      setSigningOut(false);
    }
  };

  // Variables related to the three settings sections rendered as cards.
  const settingsSections: SettingsSection[] = [
    {
      title: t.settings.account,
      items: [
        { icon: User, label: t.settings.editProfile,   path: '/profile'       },
        { icon: Bell, label: t.settings.notifications, path: '/notifications' },
        { icon: Lock, label: t.settings.privacy,       path: '/privacy'       }
      ]
    },
    {
      title: t.settings.preferences,
      items: [
        { icon: Palette, label: t.settings.appearance, path: '/appearance' },
        { icon: Moon,    label: t.settings.sleepMode,  path: '/sleep-mode',  toggle: true },
        { icon: Globe,   label: t.settings.language,   path: '/language',    subtitle: getLanguageDisplay() }
      ]
    },
    {
      title: t.settings.support,
      items: [
        { icon: HelpCircle, label: t.settings.helpCenter, path: '/help'    },
        { icon: LogOut,     label: t.settings.signOut,    path: 'sign-out', danger: true }
      ]
    }
  ];

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        <h4 className="mb-6">{t.settings.title}</h4>

        {/* Profile summary card — tap to open /profile */}
        <Card className="mb-6 cursor-pointer" onClick={() => navigate('/profile')}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-mid-dark)] flex items-center justify-center text-white">
              <span className="text-[24px]">{avatarLetter}</span>
            </div>
            <div className="flex-1">
              <h6 className="mb-1">{displayName}</h6>
              <p className="text-body2 text-[var(--color-mid-dark)]">{displayEmail}</p>
            </div>
            <ChevronRight size={24} className="text-[var(--color-mid-dark)]" />
          </div>
        </Card>

        {/* Settings sections — rendered as grouped cards */}
        {settingsSections.map((section) => (
          <div key={section.title} className="mb-6">
            <h6 className="mb-3 text-[var(--color-mid-dark)]">{section.title}</h6>
            <Card className="divide-y divide-[var(--color-lighter)]">
              {section.items.map((item) => {
                const Icon = item.icon;
                const handleClick = () => {
                  if (item.path === 'sign-out') {
                    setShowSignOutDialog(true);
                  } else {
                    navigate(item.path);
                  }
                };
                return (
                  <button
                    key={item.label}
                    onClick={handleClick}
                    className={`w-full flex items-center gap-4 py-4 hover:bg-[var(--color-lightest)] transition-colors ${item.danger ? 'text-red-600' : ''}`}
                  >
                    <Icon size={20} className={item.danger ? 'text-red-600' : 'text-[var(--color-mid-dark)]'} />
                    <div className="flex-1 text-left">
                      <span className="text-body2 block">{item.label}</span>
                      {item.subtitle && (
                        <span className="text-caption text-[var(--color-mid-dark)]">{item.subtitle}</span>
                      )}
                    </div>
                    {item.toggle ? (
                      <div className="w-12 h-6 bg-[var(--color-lighter)] rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm transition-transform"></div>
                      </div>
                    ) : (
                      <ChevronRight size={20} className={item.danger ? 'text-red-600' : 'text-[var(--color-mid-dark)]'} />
                    )}
                  </button>
                );
              })}
            </Card>
          </div>
        ))}

        {/* Footer: app name + version */}
        <div className="text-center">
          <p className="text-caption text-[var(--color-mid-dark)] mb-1">ÉLAN Wellness</p>
          <p className="text-caption text-[var(--color-mid-dark)]">{t.settings.version} 1.0.0</p>
        </div>
      </div>

      {/* Sign-out confirmation modal */}
      {showSignOutDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <Card className="w-full max-w-sm">
            <h6 className="mb-2">{t.settings.signOut}</h6>
            <p className="text-body2 text-[var(--color-mid-dark)] mb-6">
              {t.settings.signOutConfirm}
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSignOutDialog(false)}
                className="flex-1"
                disabled={signingOut}
              >
                {t.common.cancel}
              </Button>
              <Button onClick={handleSignOut} className="flex-1" disabled={signingOut}>
                {signingOut ? '...' : t.settings.signOut}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </MobileLayout>
  );
}
