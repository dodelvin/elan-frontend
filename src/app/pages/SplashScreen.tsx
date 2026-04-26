/**
 * SplashScreen.tsx
 * ----------------
 * First screen the user sees on app launch. Shows the brand logo over a
 * gradient background, then auto-navigates to /welcome after 2.5 seconds.
 *
 * Route: /
 *
 * Contains:
 *   - <SplashScreen />
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ElanLogo } from '../components/ElanLogo';

/**
 * SplashScreen
 * ------------
 * No props. Sets a setTimeout on mount that navigates to /welcome after
 * 2500 ms, and clears the timer on unmount to avoid leaks.
 */
export function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-bg-primary)] w-full max-w-[500px] sm:max-w-[430px] mx-auto">
      <div className="animate-pulse">
        <ElanLogo size="large" variant="light" />
      </div>
    </div>
  );
}
