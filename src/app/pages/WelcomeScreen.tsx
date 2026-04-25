/**
 * WelcomeScreen.tsx
 * -----------------
 * Brand intro screen offering the two entry paths into the app:
 * Sign Up (new user) → /onboarding, or Sign In (returning) → /signin.
 *
 * Route: /welcome
 *
 * Contains:
 *   - <WelcomeScreen />
 */

import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ElanLogo } from '../components/ElanLogo';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * WelcomeScreen
 * -------------
 * No props. Renders the logo, a localized subtitle, and two action buttons.
 * Uses useNavigate() to route on click.
 */
export function WelcomeScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col max-w-[430px] mx-auto bg-[var(--color-lightest)]">
      <div className="flex-1 flex flex-col justify-center px-6 pb-8">
        <div className="text-center mb-12">
          <ElanLogo size="default" variant="dark" />
          <p className="text-body1 text-[var(--color-dark)] mt-6 max-w-xs mx-auto">
            {t.welcome.subtitle}
          </p>
        </div>

        {/* Two CTAs — primary for new users, outline for returning */}
        <div className="space-y-4">
          <Button fullWidth onClick={() => navigate('/onboarding')}>
            {t.welcome.signUp}
          </Button>
          <Button fullWidth variant="outline" onClick={() => navigate('/signin')}>
            {t.welcome.signIn}
          </Button>
        </div>
      </div>
    </div>
  );
}
