import { useEffect, useRef, useState } from 'react';
import { Moon, Plus, Minus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

import { MobileLayout } from '../components/MobileLayout';
import { BackButton } from '../components/BackButton';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { apiGet, apiPost } from '../lib/api';
import { useGoals } from '../lib/useGoals';

interface MetricsResponse {
  metrics: { water: number; steps: number; sleep: number; mood: string | null; mindfulness: number };
}
interface AnalyticsResponse {
  sleepData: { day: string; hours: number }[];
}

export function SleepDetailScreen() {
  const { t } = useLanguage();
  const [goals] = useGoals();
  const goalHours = goals.sleepGoal;

  const [todayHours, setTodayHours] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [weekHours, setWeekHours] = useState<{ day: string; hours: number }[]>([]);

  useEffect(() => {
    apiGet<MetricsResponse>('/api/metrics/today')
      .then((r) => { setTodayHours(r.metrics.sleep || 0); setLoaded(true); })
      .catch(() => setLoaded(true));
    apiGet<AnalyticsResponse>('/api/analytics/weekly')
      .then((r) => setWeekHours(r.sleepData || []))
      .catch(() => {});
  }, []);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await apiPost('/api/metrics/today', { sleep: todayHours });
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1000);
      } catch {}
    }, 500);
  }, [todayHours, loaded]);

  // Y-axis based on goal/4 — e.g. 8 hours → [0, 2, 4, 6, 8]
  const yTicks = [0, goalHours / 4, goalHours / 2, (goalHours * 3) / 4, goalHours];

  const weekData = weekHours.length === 7
    ? weekHours.map((d, i) => ({ id: `d${i}`, day: d.day, hours: d.hours, date: String(new Date().getDate() - (6 - i)) }))
    : [];

  const avgHours = weekData.length
    ? (weekData.reduce((s, d) => s + d.hours, 0) / weekData.length).toFixed(1)
    : '0.0';
  const totalHours = weekData.reduce((s, d) => s + d.hours, 0).toFixed(1);

  return (
    <MobileLayout showNav={false}>
      <BackButton rightSlot={savedFlash ? <span className="text-caption text-green-600">✓ Saved</span> : null} />

      <div className="px-6 pt-24 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
            <Moon size={28} className="text-purple-500" />
          </div>
          <div>
            <h4 className="mb-1">{t.dashboard.sleep}</h4>
            <p className="text-body2 text-[var(--color-mid-dark)]">{t.analytics.activityTrends}</p>
          </div>
        </div>

        <Card className="mb-6 bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <div className="text-center py-6">
            <p className="text-subtitle2 text-[var(--color-mid-dark)] mb-2">{t.fitness.today}</p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button variant="outline" onClick={() => setTodayHours(Math.max(0, todayHours - 0.5))} className="w-12 h-12 rounded-full p-0 flex items-center justify-center">
                <Minus size={20} />
              </Button>
              <h2 className="text-purple-600">{todayHours}h</h2>
              <Button onClick={() => setTodayHours(Math.min(12, todayHours + 0.5))} className="w-12 h-12 rounded-full p-0 flex items-center justify-center bg-purple-500 hover:bg-purple-600">
                <Plus size={20} className="text-white" />
              </Button>
            </div>
            <div className="w-full bg-[var(--color-lighter)] rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((todayHours / goalHours) * 100, 100)}%` }} />
            </div>
            <p className="text-caption text-[var(--color-mid-dark)]">
              {todayHours >= goalHours ? t.fitness.goalReached : `${(goalHours - todayHours).toFixed(1)}h ${t.fitness.toGoal}`}
            </p>
          </div>
        </Card>

        <h6 className="mb-4">{t.fitness.thisWeek}</h6>
        <Card className="mb-6 p-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-lighter)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-mid-dark)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-mid-dark)', fontSize: 12 }}
                domain={[0, goalHours]} ticks={yTicks} />
              <Bar dataKey="hours" radius={[8, 8, 0, 0]} barSize={32}>
                {weekData.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.hours >= goalHours ? '#a855f7' : '#d8b4fe'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <h6 className="mb-4">{t.fitness.statistics}</h6>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Moon size={16} className="text-purple-500" />
              <p className="text-caption text-[var(--color-mid-dark)]">{t.fitness.average}</p>
            </div>
            <h5>{avgHours}h</h5>
            <p className="text-caption text-[var(--color-mid-dark)]">{t.analytics.perDay}</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Moon size={16} className="text-purple-500" />
              <p className="text-caption text-[var(--color-mid-dark)]">{t.fitness.total}</p>
            </div>
            <h5>{totalHours}h</h5>
            <p className="text-caption text-[var(--color-mid-dark)]">{t.fitness.thisWeek}</p>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}
