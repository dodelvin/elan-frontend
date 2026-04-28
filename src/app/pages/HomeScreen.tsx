import React from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { useNavigate } from 'react-router-dom';
import { Activity, Droplet, Moon, Smile, Brain, Heart, TrendingUp, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useGoals } from '../lib/useGoals';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { apiGet } from '../lib/api';
import { subscribeToSteps } from '../lib/stepCounter';

export function HomeScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [goals, saveGoals] = useGoals();
  const { user } = useAuth();
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'there';
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const [liveSteps, setLiveSteps] = useState(0);
  useEffect(() => subscribeToSteps(setLiveSteps), []);

  // Today's metrics from /api/metrics/today
  const [todayMetrics, setTodayMetrics] = useState({
    steps: 0, water: 0, sleep: 0, mood: null as string | null
  });

  useEffect(() => {
    apiGet<{ metrics?: { steps?: number; water?: number; sleep?: number; mood?: string | null } }>(
      '/api/metrics/today'
    )
      .then((r) => {
        const m = r.metrics || {};
        setTodayMetrics({
          steps: m.steps ?? 0,
          water: m.water ?? 0,
          sleep: m.sleep ?? 0,
          mood: m.mood ?? null
        });
      })
      .catch(() => { });
  }, []);


  const moodLabel = todayMetrics.mood
    ? { great: t.dashboard.great, good: t.dashboard.good, okay: t.dashboard.okay, low: t.dashboard.low }[todayMetrics.mood] || '—'
    : '—';

  const quickStats = [
    { icon: Activity, label: t.dashboard.steps, value: (liveSteps || todayMetrics.steps).toLocaleString(), color: '#400101' },
    { icon: Droplet, label: t.dashboard.water, value: `${todayMetrics.water}/${goals.waterGoal}`, color: '#7E6961' },
    { icon: Moon, label: t.dashboard.sleep, value: `${todayMetrics.sleep}h`, color: '#B2A5A0' },
    { icon: Smile, label: t.dashboard.mood, value: moodLabel, color: '#400101' }
  ];

  const todayGoals = [
    { id: 1, title: t.dashboard.morningYoga, completed: true, time: `10 ${t.dashboard.min}` },
    { id: 2, title: `${t.dashboard.logWater}`, completed: false, time: '6/8' },
    { id: 3, title: t.dashboard.startWorkout, completed: false, time: `30 ${t.dashboard.min}` },
    { id: 4, title: t.dashboard.logMeal, completed: false, time: t.dashboard.pending }
  ];

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

        {/* Daily Quote */}
        <Card className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white border-0">
          <p className="text-subtitle1 italic mb-2">"Wellness is the complete integration of body, mind, and spirit."</p>
          <p className="text-caption opacity-80">— Greg Anderson</p>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="px-6 mb-6">
        <h6 className="mb-4">{t.dashboard.todayProgress}</h6>
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            const isSteps = stat.label === t.dashboard.steps;
            const isWater = stat.label === t.dashboard.water;
            const isSleep = stat.label === t.dashboard.sleep;
            const isMood = stat.label === t.dashboard.mood;
            const isClickable = isSteps || isWater || isSleep || isMood;

            const handleClick = () => {
              if (isSteps) navigate('/steps');
              if (isWater) navigate('/water');
              if (isSleep) navigate('/sleep');
              if (isMood) navigate('/mood');
            };

            return (
              <Card
                key={stat.label}
                className={`flex flex-col items-center text-center py-4 ${isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                onClick={handleClick}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: stat.color + '15' }}
                >
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <p className="text-subtitle2 mb-1">{stat.value}</p>
                <p className="text-caption text-[var(--color-mid-dark)]">{stat.label}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Today's Goals */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h6>{t.dashboard.dailyGoals}</h6>
          <button
            onClick={() => navigate('/daily-goals')}
            className="text-subtitle2 text-[var(--color-primary)] hover:underline"
          >
            View All →
          </button>
        </div>
        <Card className="cursor-pointer" onClick={() => navigate('/daily-goals')}>
          <div className="space-y-4">
            {todayGoals.map((goal) => (
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

      {/* Quick Actions */}
      <div className="px-6 mb-6">
        <h6 className="mb-4">{t.dashboard.quickActions}</h6>
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center py-4 cursor-pointer" onClick={() => navigate('/goals')}>
            <Activity size={32} className="mx-auto mb-2 text-[var(--color-primary)]" />
            <p className="text-caption">{t.goals.title}</p>
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

      {/* Featured Card */}
      <section className="px-6 mb-6">
        <h6 className="mb-4">{t.meditation.title}</h6>
        <Card>
          <h6 className="mb-2">{t.meditation.sleepMeditation}</h6>
          <p className="text-body2 text-[var(--color-mid-dark)] mb-3">
            {t.meditation.sleepDesc}
          </p>
          <button className="text-subtitle2 text-[var(--color-primary)] hover:underline">
            {t.dashboard.startWorkout} →
          </button>
        </Card>
      </section>
    </MobileLayout>
  );
}