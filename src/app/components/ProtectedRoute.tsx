/**
 * components/ProtectedRoute.tsx
 * -----------------------------
 * Route guard. Wraps any screen that requires authentication.
 *
 *   - While the auth check is loading, renders nothing (blank) so we
 *     don't flash the welcome screen at signed-in users on refresh.
 *   - If no user is signed in, redirects to /welcome.
 *   - Otherwise renders the wrapped children normally.
 *
 * Contains:
 *   - <ProtectedRoute />
 */

import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * ProtectedRoute
 * Takes children. Returns either the children, a redirect, or null
 * depending on auth state.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  // Auth status not resolved yet — render nothing to avoid a flicker.
  if (loading) return null;

  // No user — bounce to /welcome and replace history so back button
  // doesn't loop the user back into the protected screen.
  if (!user) return <Navigate to="/welcome" replace />;

  // Signed in — render the protected screen.
  return <>{children}</>;
}
