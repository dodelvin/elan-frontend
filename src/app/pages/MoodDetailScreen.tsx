import { useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { ChevronLeft, Smile } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

export function MoodDetailScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [todayMood, setTodayMood] = useState<'great' | 'good' | 'okay' | 'low'>('great');
  const [todayStress, setTodayStress] = useState<'low' | 'medium' | 'high'>('low');

  const moods = [
    { value: 'great' as const, emoji: '😊', label: t.dashboard.great, color: '#22c55e' },
    { value: 'good' as const, emoji: '🙂', label: t.dashboard.good, color: '#84cc16' },
    { value: 'okay' as const, emoji: '😐', label: t.dashboard.okay, color: '#eab308' },
    { value: 'low' as const, emoji: '😔', label: t.dashboard.low, color: '#f97316' }
  ];

  const stressLevels = [
    { value: 'low' as const, label: t.dashboard.low, color: '#22c55e' },
    { value: 'medium' as const, label: t.fitness.medium, color: '#eab308' },
    { value: 'high' as const, label: t.fitness.high, color: '#ef4444' }
  ];

  // Map mood to numeric value for chart
  const moodToValue = { low: 1, okay: 2, good: 3, great: 4 };

  const weekData = [
    { id: 'mon', day: t.fitness.mon, mood: 'good', moodValue: 3, date: '20' },
    { id: 'tue', day: t.fitness.tue, mood: 'great', moodValue: 4, date: '21' },
    { id: 'wed', day: t.fitness.wed, mood: 'okay', moodValue: 2, date: '22' },
    { id: 'thu', day: t.fitness.thu, mood: 'great', moodValue: 4, date: '23' },
    { id: 'fri', day: t.fitness.fri, mood: 'great', moodValue: 4, date: '24' },
    { id: 'sat', day: t.fitness.sat, mood: 'good', moodValue: 3, date: '25' },
    { id: 'sun', day: t.fitness.sun, mood: 'great', moodValue: 4, date: '26' }
  ];

  const getMoodColor = (value: number) => {
    if (value >= 4) return '#22c55e';
    if (value >= 3) return '#84cc16';
    if (value >= 2) return '#eab308';
    return '#f97316';
  };

  return (
    <MobileLayout showNav={false}>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 max-w-[430px] mx-auto bg-[var(--color-lightest)] z-10 px-6 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--color-dark)] hover:text-[var(--color-darkest)]"
        >
          <ChevronLeft size={20} />
          <span className="text-body1">{t.common.back}</span>
        </button>
      </div>

      <div className="px-6 pt-24 pb-24">
        {/* Title Section */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center">
            <Smile size={28} className="text-yellow-500" />
          </div>
          <div>
            <h4 className="mb-1">{t.dashboard.mood}</h4>
            <p className="text-body2 text-[var(--color-mid-dark)]">{t.analytics.activityTrends}</p>
          </div>
        </div>

        {/* Today's Mood */}
        <h6 className="mb-4">{t.fitness.today}</h6>
        <Card className="mb-4">
          <h6 className="mb-4">{t.dashboard.mood}</h6>
          <div className="grid grid-cols-4 gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setTodayMood(m.value)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                  todayMood === m.value
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-lightest)] text-[var(--color-dark)]'
                }`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-caption">{m.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Stress Level */}
        <Card className="mb-6">
          <h6 className="mb-4">{t.fitness.stressLevel}</h6>
          <div className="grid grid-cols-3 gap-2">
            {stressLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => setTodayStress(level.value)}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  todayStress === level.value
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-lightest)] text-[var(--color-dark)]'
                }`}
              >
                <span className="text-body2">{level.label}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Week Overview */}
        <h6 className="mb-4">{t.fitness.thisWeek}</h6>
        <Card className="mb-6 p-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-lighter)" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-mid-dark)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'var(--color-mid-dark)', fontSize: 12 }}
                domain={[0, 4]}
                ticks={[0, 1, 2, 3, 4]}
                tickFormatter={(value) => {
                  const labels = ['', t.dashboard.low, t.dashboard.okay, t.dashboard.good, t.dashboard.great];
                  return labels[value] || '';
                }}
              />
              <Bar dataKey="moodValue" radius={[8, 8, 0, 0]} barSize={32}>
                {weekData.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={getMoodColor(entry.moodValue)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Day Labels with Dates */}
          <div className="flex justify-between mt-2 px-2">
            {weekData.map((day) => (
              <div key={`date-${day.id}`} className="flex flex-col items-center" style={{ width: '14%' }}>
                <p className="text-caption text-[var(--color-mid-dark)]">{day.date}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MobileLayout>
  );
}
