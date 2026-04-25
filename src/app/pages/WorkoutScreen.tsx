/**
 * WorkoutScreen.tsx
 * -----------------
 * Workout catalog. Stats from GET /api/workouts/sessions, catalog from
 * GET /api/workouts. Tapping a card POSTs a session to
 * /api/workouts/sessions.
 *
 * Route: /workout
 */

import { useEffect, useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChevronLeft, Play, Clock, Flame, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { apiGet, apiPost } from '../lib/api';

interface Workout {
  id: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  calories: string;
  description: string;
}

interface WeeklyStats {
  totals: { timeMinutes: number; caloriesBurned: number; workoutsCompleted: number };
}

/**
 * WorkoutScreen
 * No props. Fetches catalog + weekly stats on mount; tapping a card logs
 * a completion and refreshes stats.
 */
export function WorkoutScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<WeeklyStats['totals']>({ timeMinutes: 0, caloriesBurned: 0, workoutsCompleted: 0 });

  // Fetch catalog + stats in parallel.
  useEffect(() => {
    apiGet<{ workouts: Workout[] }>('/api/workouts').then((r) => setWorkouts(r.workouts)).catch(() => {});
    apiGet<WeeklyStats>('/api/workouts/sessions').then((r) => setStats(r.totals)).catch(() => {});
  }, []);

  /**
   * handleStart
   * Takes a workout. POSTs a session log with parsed duration/calories,
   * then refetches the weekly stats so the tiles update.
   */
  const handleStart = async (w: Workout) => {
    const minutes = parseInt(w.duration, 10) || 0;
    const cal = parseInt(w.calories, 10) || 0;
    try {
      await apiPost('/api/workouts/sessions', {
        workoutId: w.id,
        durationMinutes: minutes,
        caloriesBurned: cal
      });
      const fresh = await apiGet<WeeklyStats>('/api/workouts/sessions');
      setStats(fresh.totals);
      alert(`Logged: ${w.title} 💪`);
    } catch (err: any) {
      alert(`Failed: ${err.message}`);
    }
  };

  // Variables related to the three weekly summary tiles
  const summary = [
    { icon: Clock,    value: `${Math.floor(stats.timeMinutes / 60)}h ${stats.timeMinutes % 60}m`, subtitle: 'This week' },
    { icon: Flame,    value: stats.caloriesBurned.toLocaleString(),                                subtitle: 'Burned'    },
    { icon: Dumbbell, value: String(stats.workoutsCompleted),                                       subtitle: 'Completed' }
  ];

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/home')} className="text-[var(--color-darkest)]">
            <ChevronLeft size={24} />
          </button>
          <h4>Workout Plans</h4>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {summary.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="text-center py-4">
                <Icon size={24} className="mx-auto mb-2 text-[var(--color-primary)]" />
                <p className="text-subtitle2 mb-1">{s.value}</p>
                <p className="text-caption text-[var(--color-mid-dark)]">{s.subtitle}</p>
              </Card>
            );
          })}
        </div>

        <h6 className="mb-4">Available Workouts</h6>
        <div className="space-y-3">
          {workouts.map((w) => (
            <Card key={w.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleStart(w)}>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                  <Play size={28} className="text-white ml-1" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h6 className="mb-1">{w.title}</h6>
                      <p className="text-caption text-[var(--color-mid-dark)]">{w.category}</p>
                    </div>
                    <span className="text-caption bg-[var(--color-lighter)] px-3 py-1 rounded-full">{w.level}</span>
                  </div>
                  <p className="text-body2 text-[var(--color-dark)] mb-3">{w.description}</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-[var(--color-mid-dark)]" />
                      <span className="text-caption text-[var(--color-mid-dark)]">{w.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame size={14} className="text-[var(--color-mid-dark)]" />
                      <span className="text-caption text-[var(--color-mid-dark)]">{w.calories}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button fullWidth className="mt-6" onClick={() => alert('Custom workout creator coming soon! 🏋️')}>
          {t.workouts.viewProgram}
        </Button>
      </div>
    </MobileLayout>
  );
}
