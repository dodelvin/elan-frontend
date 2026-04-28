/**
 * SplashScreen.tsx
 * ----------------
 * First screen on launch. Waits for Firebase Auth to determine if there's
 * an existing session, then routes to /home (signed in) or /welcome (not).
 *
 * Route: /
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ElanLogo } from '../components/ElanLogo';
import { useAuth } from '../contexts/AuthContext';

export function SplashScreen() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Wait for Firebase to restore (or confirm absence of) a session.
    if (loading) return;

    // Brief splash for branding, then route based on auth state.
    const timer = setTimeout(() => {
      if (user) navigate('/home', { replace: true });
      else      navigate('/welcome', { replace: true });
    }, 1200);

    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-light)] to-[var(--color-bg-primary)] w-full max-w-[500px] sm:max-w-[430px] mx-auto">
      <div className="animate-pulse">
        <ElanLogo size="large" variant="light" />
      </div>
    </div>
  );
}