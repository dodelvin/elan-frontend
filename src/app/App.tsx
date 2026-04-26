import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { SplashScreen } from "./pages/SplashScreen";
import { WelcomeScreen } from "./pages/WelcomeScreen";
import { OnboardingScreen } from "./pages/OnboardingScreen";
import { SignUpScreen } from "./pages/SignUpScreen";
import { SignInScreen } from "./pages/SignInScreen";
import { HomeScreen } from "./pages/HomeScreen";
import { TrackerScreen } from "./pages/TrackerScreen";
// import { MealTrackerScreen } from "./pages/MealTrackerScreen";
import { WorkoutScreen } from "./pages/WorkoutScreen";
import { MeditationScreen } from "./pages/MeditationScreen";
import { AnalyticsScreen } from "./pages/AnalyticsScreen";
import { CommunityScreen } from "./pages/CommunityScreen";
import { ShopScreen } from "./pages/ShopScreen";
import { SettingsScreen } from "./pages/SettingsScreen";
import { HelpScreen } from "./pages/HelpScreen";
import { ProfileScreen } from "./pages/ProfileScreen";
import { LanguageSelectionScreen } from "./pages/LanguageSelectionScreen";
import { MeditationSessionScreen } from "./pages/MeditationSessionScreen";
import { NotificationsScreen } from "./pages/NotificationsScreen";
import { PrivacyScreen } from "./pages/PrivacyScreen";
import { AppearanceScreen } from "./pages/AppearanceScreen";
import { StepsDetailScreen } from "./pages/StepsDetailScreen";
import { WaterDetailScreen } from "./pages/WaterDetailScreen";
import { SleepDetailScreen } from "./pages/SleepDetailScreen";
import { DailyGoalsScreen } from "./pages/DailyGoalsScreen";
import { MoodDetailScreen } from "./pages/MoodDetailScreen";
import { GoalsScreen } from "./pages/GoalsScreen";

const P = ({ children }: { children: any }) => <ProtectedRoute>{children}</ProtectedRoute>;

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-[var(--color-lightest)]">
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/welcome" element={<WelcomeScreen />} />
              <Route path="/onboarding" element={<OnboardingScreen />} />
              <Route path="/signup" element={<SignUpScreen />} />
              <Route path="/signin" element={<SignInScreen />} />

              <Route path="/home"        element={<P><HomeScreen /></P>} />
              <Route path="/tracker"     element={<P><TrackerScreen /></P>} />
              <Route path="/workout"     element={<P><WorkoutScreen /></P>} />
              <Route path="/meditation"  element={<P><MeditationScreen /></P>} />
              <Route path="/meditation/:sessionId" element={<P><MeditationSessionScreen /></P>} />
              <Route path="/analytics"   element={<P><AnalyticsScreen /></P>} />
              <Route path="/community"   element={<P><CommunityScreen /></P>} />
              <Route path="/shop"        element={<P><ShopScreen /></P>} />
              <Route path="/settings"    element={<P><SettingsScreen /></P>} />
              <Route path="/help"        element={<P><HelpScreen /></P>} />
              <Route path="/profile"     element={<P><ProfileScreen /></P>} />
              <Route path="/language"      element={<P><LanguageSelectionScreen /></P>} />
              <Route path="/notifications" element={<P><NotificationsScreen /></P>} />
              <Route path="/privacy"       element={<P><PrivacyScreen /></P>} />
              <Route path="/appearance"    element={<P><AppearanceScreen /></P>} />
              <Route path="/steps"       element={<P><StepsDetailScreen /></P>} />
              <Route path="/water"       element={<P><WaterDetailScreen /></P>} />
              <Route path="/sleep"       element={<P><SleepDetailScreen /></P>} />
              <Route path="/daily-goals" element={<P><DailyGoalsScreen /></P>} />
              <Route path="/mood"        element={<P><MoodDetailScreen /></P>} />
              <Route path="/goals"       element={<P><GoalsScreen /></P>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
