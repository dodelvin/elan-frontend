import { useEffect, useRef, useState } from 'react';
import { Smile } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

import { MobileLayout } from '../components/MobileLayout';
import { BackButton } from '../components/BackButton';
import { Card } from '../components/Card';
import { apiGet, apiPost } from '../lib/api';

type Mood = 'great' | 'good' | 'okay' | 'low';

interface MetricsResponse {
  metrics: { water: number; steps: number; sleep: number; mood: Mood | null; mindfulness: number };
}

export function MoodDetailScreen() {
  const { t } = useLanguage();

  const [todayMood, setTodayMood] = useState<Mood | null>(null);
  const [todayStress, setTodayStress] = useState<'low' | 'medium' | 'high'>('low');
  const [loaded, setLoaded] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    apiGet<MetricsResponse>('/api/metrics/today')
      .then((r) => { setTodayMood(r.metrics.mood as Mood | null);setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await apiPost('/api/metrics/today', { mood: todayMood, stress: todayStress });
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1000);
      } catch { }
    }, 500);
  }, [todayMood, todayStress, loaded]);

  const moods = [
    { value: 'great' as const, emoji: '😊', label: 'Great' },
    { value: 'good' as const, emoji: '🙂', label: 'Good' },
    { value: 'okay' as const, emoji: '😐', label: 'Normal' },
    { value: 'low' as const, emoji: '😔', label: 'Bad' }
  ];

  const stressLevels = [
    { value: 'low' as const, label: 'Low' },
    { value: 'medium' as const, label: 'Medium' },
    { value: 'high' as const, label: 'High' }
  ];

  // Mood scale: 1=Bad, 2=Normal, 3=Good, 4=Great
  const moodToValue: Record<Mood, number> = { low: 1, okay: 2, good: 3, great: 4 };
  const todayValue = todayMood ? moodToValue[todayMood] : 0;

  const weekData = [
    { id: 'mon', day: 'Mon', moodValue: 3, date: '20' },
    { id: 'tue', day: 'Tue', moodValue: 4, date: '21' },
    { id: 'wed', day: 'Wed', moodValue: 2, date: '22' },
    { id: 'thu', day: 'Thu', moodValue: 4, date: '23' },
    { id: 'fri', day: 'Fri', moodValue: 4, date: '24' },
    { id: 'sat', day: 'Sat', moodValue: 3, date: '25' },
    { id: 'sun', day: 'Sun', moodValue: todayValue || 4, date: '26' }
  ];

  const moodLabels = ['', 'Bad', 'Normal', 'Good', 'Great'];
  const getMoodColor = (v: number) => v >= 4 ? '#22c55e' : v >= 3 ? '#84cc16' : v >= 2 ? '#eab308' : '#f97316';

  return (
    <MobileLayout showNav={false}>
      <BackButton rightSlot={savedFlash ? <span className="text-caption text-green-600">✓ Saved</span> : null} />

      <div className="px-6 pt-24 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center">
            <Smile size={28} className="text-yellow-500" />
          </div>
          <div>
            <h4 className="mb-1">{t.dashboard.mood}</h4>
            <p className="text-body2 text-[var(--color-mid-dark)]">{t.analytics.activityTrends}</p>
          </div>
        </div>

        <h6 className="mb-4">{t.fitness.today}</h6>
        <Card className="mb-4">
          <h6 className="mb-4">{t.dashboard.mood}</h6>
          <div className="grid grid-cols-4 gap-2">
            {moods.map((m) => (
              <button key={m.value} onClick={() => setTodayMood(m.value)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${todayMood === m.value ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-lightest)] text-[var(--color-dark)]'
                  }`}>
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-caption">{m.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="mb-6">
          <h6 className="mb-4">Stress Level</h6>
          <div className="grid grid-cols-3 gap-2">
            {stressLevels.map((level) => (
              <button key={level.value} onClick={() => setTodayStress(level.value)}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${todayStress === level.value ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-lightest)] text-[var(--color-dark)]'
                  }`}>
                <span className="text-body2">{level.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <h6 className="mb-4">This Week</h6>
        <Card className="mb-6 p-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-lighter)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-mid-dark)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-mid-dark)', fontSize: 11 }}
                domain={[0, 4]} ticks={[0, 1, 2, 3, 4]}
                tickFormatter={(v) => moodLabels[v] || ''} />
              <Bar dataKey="moodValue" radius={[8, 8, 0, 0]} barSize={32}>
                {weekData.map((e) => <Cell key={`cell-${e.id}`} fill={getMoodColor(e.moodValue)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </MobileLayout>
  );
}
