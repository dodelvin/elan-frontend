import { useEffect, useRef, useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { ChevronLeft, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { apiGet, apiPost } from '../lib/api';

type Mood = 'great' | 'good' | 'okay' | 'low';

interface MetricsResponse {
  metrics: { water: number; steps: number; sleep: number; mood: Mood | null; mindfulness: number };
}

export function MoodDetailScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [todayMood, setTodayMood] = useState<Mood | null>(null);
  const [todayStress, setTodayStress] = useState<'low' | 'medium' | 'high'>('low');
  const [loaded, setLoaded] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    apiGet<MetricsResponse>('/api/metrics/today')
      .then((r) => { setTodayMood(r.metrics.mood as Mood | null); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, []);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!loaded || !todayMood) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await apiPost('/api/metrics/today', { mood: todayMood });
        setSavedFlash(true);
        setTimeout(() => setSavedFlash(false), 1000);
      } catch {}
    }, 500);
  }, [todayMood, loaded]);

  const moods = [
    { value: 'great' as const, emoji: '😊', label: t.dashboard.great },
    { value: 'good'  as const, emoji: '🙂', label: t.dashboard.good  },
    { value: 'okay'  as const, emoji: '😐', label: t.dashboard.okay  },
    { value: 'low'   as const, emoji: '😔', label: t.dashboard.low   }
  ];

  const stressLevels = [
    { value: 'low' as const,    label: t.dashboard.low    },
    { value: 'medium' as const, label: t.fitness.medium   },
    { value: 'high' as const,   label: t.fitness.high     }
  ];

  // Static-ish week chart placeholder; keeps the visual without faking
  // numbers that drift weirdly. Backend doesn't currently expose mood per day.
  const moodToValue: Record<Mood, number> = { low: 1, okay: 2, good: 3, great: 4 };
  const todayValue = todayMood ? moodToValue[todayMood] : 0;
  const weekData = [
    { id: 'mon', day: t.fitness.mon, moodValue: 3, date: '20' },
    { id: 'tue', day: t.fitness.tue, moodValue: 4, date: '21' },
    { id: 'wed', day: t.fitness.wed, moodValue: 2, date: '22' },
    { id: 'thu', day: t.fitness.thu, moodValue: 4, date: '23' },
    { id: 'fri', day: t.fitness.fri, moodValue: 4, date: '24' },
    { id: 'sat', day: t.fitness.sat, moodValue: 3, date: '25' },
    { id: 'sun', day: t.fitness.sun, moodValue: todayValue || 4, date: '26' }
  ];

  const getMoodColor = (v: number) => v >= 4 ? '#22c55e' : v >= 3 ? '#84cc16' : v >= 2 ? '#eab308' : '#f97316';

  return (
    <MobileLayout showNav={false}>
      <div className="fixed top-0 left-0 right-0 max-w-[430px] mx-auto bg-[var(--color-lightest)] z-10 px-6 pt-12 pb-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[var(--color-dark)]">
          <ChevronLeft size={20} />
          <span className="text-body1">{t.common.back}</span>
        </button>
        {savedFlash && <span className="text-caption text-green-600">✓ Saved</span>}
      </div>

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
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                  todayMood === m.value ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-lightest)] text-[var(--color-dark)]'
                }`}>
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-caption">{m.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="mb-6">
          <h6 className="mb-4">{t.fitness.stressLevel}</h6>
          <div className="grid grid-cols-3 gap-2">
            {stressLevels.map((level) => (
              <button key={level.value} onClick={() => setTodayStress(level.value)}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  todayStress === level.value ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-lightest)] text-[var(--color-dark)]'
                }`}>
                <span className="text-body2">{level.label}</span>
              </button>
            ))}
          </div>
        </Card>

        <h6 className="mb-4">{t.fitness.thisWeek}</h6>
        <Card className="mb-6 p-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-lighter)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-mid-dark)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-mid-dark)', fontSize: 12 }}
                domain={[0, 4]} ticks={[0, 1, 2, 3, 4]}
                tickFormatter={(v) => ['', t.dashboard.low, t.dashboard.okay, t.dashboard.good, t.dashboard.great][v] || ''} />
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
