/**
 * App.tsx
 * -------
 * Top-level component. Sets up the auth + language providers, the
 * router, and the full screen map. Authenticated routes are wrapped in
 * <ProtectedRoute /> so unauthenticated visitors get bounced to /welcome.
 *
 * Contains:
 *   - <App />          default export, the root component
 *
 * Route groups:
 *   - Public:    /, /welcome, /onboarding, /signup, /signin
 *   - Protected: /home, /tracker, /meals, /workout, /meditation,
 *                /analytics, /community, /shop, /settings, /help, /profile,
 *                and the settings sub-screens
 *   - Fallback:  any unknown URL redirects to /
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Pre-auth screens
import { SplashScreen } from "./pages/SplashScreen";
import { WelcomeScreen } from "./pages/WelcomeScreen";
import { OnboardingScreen } from "./pages/OnboardingScreen";
import { SignUpScreen } from "./pages/SignUpScreen";
import { SignInScreen } from "./pages/SignInScreen";

// Main app screens
import { HomeScreen } from "./pages/HomeScreen";
import { TrackerScreen } from "./pages/TrackerScreen";
// import { MealTrackerScreen } from "./pages/MealTrackerScreen";
import { WorkoutScreen } from "./pages/WorkoutScreen";
import { MeditationScreen } from "./pages/MeditationScreen";
import { MeditationSessionScreen } from "./pages/MeditationSessionScreen";
import { AnalyticsScreen } from "./pages/AnalyticsScreen";
import { CommunityScreen } from "./pages/CommunityScreen";
import { ShopScreen } from "./pages/ShopScreen";
import { SettingsScreen } from "./pages/SettingsScreen";
import { HelpScreen } from "./pages/HelpScreen";
import { ProfileScreen } from "./pages/ProfileScreen";
import { StepsDetailScreen } from "./pages/StepsDetailScreen";

// Settings sub-screens
import { LanguageSelectionScreen } from "./pages/LanguageSelectionScreen";
import { NotificationsScreen } from "./pages/NotificationsScreen";
import { PrivacyScreen } from "./pages/PrivacyScreen";
import { AppearanceScreen } from "./pages/AppearanceScreen";

/**
 * App
 * No props. Layered providers:
 *   AuthProvider (outer — auth state available everywhere)
 *     LanguageProvider (i18n)
 *       Router → Routes
 */
export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-[var(--color-lightest)]">
            <Routes>
              {/* Public routes — no auth required */}
              <Route path="/" element={<SplashScreen />} />
              <Route path="/welcome" element={<WelcomeScreen />} />
              <Route path="/onboarding" element={<OnboardingScreen />} />
              <Route path="/signup" element={<SignUpScreen />} />
              <Route path="/signin" element={<SignInScreen />} />

              {/* Protected routes — require an authenticated Firebase user */}
              <Route path="/home"        element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
              <Route path="/tracker"     element={<ProtectedRoute><TrackerScreen /></ProtectedRoute>} />
              {/* <Route path="/meals"       element={<ProtectedRoute><MealTrackerScreen /></ProtectedRoute>} /> */}
              <Route path="/workout"     element={<ProtectedRoute><WorkoutScreen /></ProtectedRoute>} />
              <Route path="/meditation"  element={<ProtectedRoute><MeditationScreen /></ProtectedRoute>} />
              <Route path="/meditation/:sessionId" element={<ProtectedRoute><MeditationSessionScreen /></ProtectedRoute>} />
              <Route path="/analytics"   element={<ProtectedRoute><AnalyticsScreen /></ProtectedRoute>} />
              <Route path="/community"   element={<ProtectedRoute><CommunityScreen /></ProtectedRoute>} />
              <Route path="/shop"        element={<ProtectedRoute><ShopScreen /></ProtectedRoute>} />
              <Route path="/settings"    element={<ProtectedRoute><SettingsScreen /></ProtectedRoute>} />
              <Route path="/help"        element={<ProtectedRoute><HelpScreen /></ProtectedRoute>} />
              <Route path="/profile"     element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
              <Route path="/steps" element={<ProtectedRoute><StepsDetailScreen /></ProtectedRoute>} />

              {/* Settings sub-screens — also protected */}
              <Route path="/language"      element={<ProtectedRoute><LanguageSelectionScreen /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><NotificationsScreen /></ProtectedRoute>} />
              <Route path="/privacy"       element={<ProtectedRoute><PrivacyScreen /></ProtectedRoute>} />
              <Route path="/appearance"    element={<ProtectedRoute><AppearanceScreen /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
