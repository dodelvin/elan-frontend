/**
 * HomeScreen.tsx
 * --------------
 * Main dashboard. Greeting + avatar (from auth user), daily quote, four
 * quick-stat cards, today's goals, three quick-action shortcuts, featured
 * recommendation. Data comes from GET /api/metrics/home.
 *
 * Route: /home
 * Implements user story US1.
 */


import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { Activity, Droplet, Moon, Smile, Brain, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { apiGet } from '../lib/api';
import { useEffect, useState } from 'react';
import { subscribeToSteps } from '../lib/stepCounter';

// Variables related to the API response shape from /api/metrics/home.
interface HomeOverview {
  quickStats: { key: string; label: string; value: string; target: string }[];
  todayGoals: { id: number; title: string; completed: boolean; time: string }[];
  quote: { text: string; author: string };
}

// Static lookup mapping a stat key to its icon + accent colour.
const STAT_ICONS: Record<string, { icon: any; color: string }> = {
  steps: { icon: Activity, color: '#400101' },
  water: { icon: Droplet,  color: '#7E6961' },
  sleep: { icon: Moon,     color: '#B2A5A0' },
  mood:  { icon: Smile,    color: '#400101' }
};

/**
 * HomeScreen
 * No props. Loads overview on mount, renders skeleton while pending.
 */
export function HomeScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [overview, setOverview] = useState<HomeOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Display name + avatar letter come from the live Firebase user.
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'there';
  const avatarLetter = displayName.charAt(0).toUpperCase();

  // inside the component:
  const [liveSteps, setLiveSteps] = useState(0);
  useEffect(() => subscribeToSteps(setLiveSteps), []);

  // Fetch the home overview on mount.
  useEffect(() => {
    apiGet<HomeOverview>('/api/metrics/home')
      .then(setOverview)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <MobileLayout>
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-subtitle2 text-[var(--color-mid-dark)]">{t.dashboard.greeting},</p>
            <h5 className="text-[var(--color-darkest)]">{displayName}</h5>
          </div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-mid-dark)] flex items-center justify-center text-white">
            <span className="text-body1">{avatarLetter}</span>
          </div>
        </div>

        {/* Daily quote — comes from backend now */}
        <Card className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white border-0">
          <p className="text-subtitle1 italic mb-2">
            &ldquo;{overview?.quote.text || '...'}&rdquo;
          </p>
          <p className="text-caption opacity-80">— {overview?.quote.author || ''}</p>
        </Card>
      </div>

      {error && (
        <div className="px-6 mb-4">
          <p className="text-body2 text-red-600">{error}</p>
        </div>
      )}

      {/* Quick stats */}
      <div className="px-6 mb-6">
        <h6 className="mb-4">{t.dashboard.todayProgress}</h6>
        <div className="grid grid-cols-2 gap-3">
          {(overview?.quickStats || []).map((stat) => {
            const { icon: Icon, color } = STAT_ICONS[stat.key] || { icon: Activity, color: '#400101' };
            return (
              <Card
                    key={stat.key}
                    className="flex flex-col items-center text-center py-4 cursor-pointer"
                    onClick={() => stat.key === 'steps' && navigate('/steps')}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: color + '15' }}
                >
                  <Icon size={24} style={{ color }} />
                </div>
                <p className="text-subtitle2 mb-1">
                  {stat.key === 'steps' ? liveSteps.toLocaleString() : stat.value}
                </p>
                <p className="text-caption text-[var(--color-mid-dark)]">{stat.label}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Today's goals */}
      <div className="px-6 mb-6">
        <h6 className="mb-4">{t.dashboard.dailyGoals}</h6>
        <Card>
          <div className="space-y-4">
            {(overview?.todayGoals || []).map((goal) => (
              <div key={goal.id} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${goal.completed ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-light)]'}`}>
                  {goal.completed && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`text-body2 ${goal.completed ? 'line-through text-[var(--color-mid-dark)]' : 'text-[var(--color-darkest)]'}`}>
                    {goal.title}
                  </p>
                </div>
                <span className="text-caption text-[var(--color-mid-dark)]">{goal.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="px-6 mb-6">
        <h6 className="mb-4">{t.dashboard.quickActions}</h6>
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center py-4 cursor-pointer" onClick={() => navigate('/tracker')}>
            <Activity size={32} className="mx-auto mb-2 text-[var(--color-primary)]" />
            <p className="text-caption">{t.fitness.title}</p>
          </Card>
          <Card className="text-center py-4 cursor-pointer" onClick={() => navigate('/meditation')}>
            <Brain size={32} className="mx-auto mb-2 text-[var(--color-primary)]" />
            <p className="text-caption">{t.dashboard.meditate}</p>
          </Card>
          <Card className="text-center py-4 cursor-pointer" onClick={() => navigate('/workout')}>
            <Heart size={32} className="mx-auto mb-2 text-[var(--color-primary)]" />
            <p className="text-caption">{t.workouts.title}</p>
          </Card>
        </div>
      </div>

      {/* Featured recommendation */}
      <section className="px-6 mb-6">
        <h6 className="mb-4">{t.meditation.title}</h6>
        <Card>
          <h6 className="mb-2">{t.meditation.sleepMeditation}</h6>
          <p className="text-body2 text-[var(--color-mid-dark)] mb-3">
            {t.meditation.sleepDesc}
          </p>
          <button
            className="text-subtitle2 text-[var(--color-primary)] hover:underline"
            onClick={() => navigate('/meditation/4')}
          >
            {t.dashboard.startWorkout} →
          </button>
        </Card>
      </section>
    </MobileLayout>
  );
}
