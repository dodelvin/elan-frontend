/**
 * TrackerScreen.tsx
 * -----------------
 * Daily wellness tracker. Loads today's values from GET /api/metrics/today
 * on mount, then saves changes via POST /api/metrics/today (debounced).
 *
 * Route: /tracker
 */

import { useEffect, useRef, useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Activity, Droplet, Moon, Brain, Plus, Minus } from 'lucide-react';
import { Button } from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { apiGet, apiPost } from '../lib/api';
import { useNavigate } from 'react-router-dom';

type Mood = 'great' | 'good' | 'okay' | 'low' | null;

interface MetricsResponse {
  date: string;
  metrics: {
    water: number;
    steps: number;
    sleep: number;
    mood: Mood;
    mindfulness: number;
  };
}

/**
 * TrackerScreen
 * No props. Holds the five metrics in local state, persists changes to
 * the backend via a 600ms debounce so we don't spam the server on every
 * +/- click.
 */
export function TrackerScreen() {
  const { t } = useLanguage();

  const [water, setWater] = useState(0);
  const [mood, setMood] = useState<Mood>(null);
  const [steps, setSteps] = useState(0);
  const [sleep, setSleep] = useState(0);
  const [mindfulness, setMindfulness] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const navigate = useNavigate();

  // Variables related to mood selector options
  const moods = [
    { value: 'great' as const, emoji: '😊', label: t.dashboard.great },
    { value: 'good' as const, emoji: '🙂', label: t.dashboard.good },
    { value: 'okay' as const, emoji: '😐', label: t.dashboard.okay },
    { value: 'low' as const, emoji: '😔', label: t.dashboard.low }
  ];

  // Load today's metrics on mount.

  // Load today's metrics on mount.
  useEffect(() => {
    apiGet<MetricsResponse>('/api/metrics/today')
      .then((data) => {
        const m = data.metrics;
        setWater(m.water || 0);
        setSteps(m.steps || 0);
        setSleep(m.sleep || 0);
        setMood(m.mood);
        setMindfulness(m.mindfulness || 0);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Debounced auto-save: any change waits 600ms, then POSTs.
  // Skips firing on the very first render (before initial load completes).
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!loaded) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus('saving');
    saveTimer.current = setTimeout(async () => {
      try {
        await apiPost('/api/metrics/today', { water, steps, sleep, mood, mindfulness });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 1200);
      } catch {
        setSaveStatus('error');
      }
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [water, steps, sleep, mood, mindfulness, loaded]);

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        <div className="flex items-center justify-between mb-2">
          <h4>{t.fitness.title}</h4>
          {/* Subtle save status */}
          {saveStatus === 'saving' && <span className="text-caption text-[var(--color-mid-dark)]">Saving…</span>}
          {saveStatus === 'saved' && <span className="text-caption text-green-600">✓ Saved</span>}
          {saveStatus === 'error' && <span className="text-caption text-red-600">⚠ Failed</span>}
        </div>
        <p className="text-body2 text-[var(--color-mid-dark)] mb-6">{t.fitness.subtitle}</p>

        {/* Hydration */}
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Droplet size={24} className="text-blue-500" />
              </div>
              <div>
                <h6>{t.meals.waterIntake}</h6>
                <p className="text-caption text-[var(--color-mid-dark)]">{t.meals.glassesTarget}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            {[...Array(8)].map((_, i) => (
              <button
                key={i}
                onClick={() => setWater(i + 1)}
                className={`flex-1 h-8 rounded-full transition-all ${i < water ? 'bg-blue-500' : 'bg-[var(--color-lighter)]'}`}
              />
            ))}
          </div>
          <p className="text-subtitle2 text-center">{water} / 8 {t.dashboard.glasses}</p>
        </Card>

        {/* Steps */}
        <Card className="mb-4 cursor-pointer" onClick={() => navigate('/steps')}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <Activity size={24} className="text-red-500" />
              </div>
              <div>
                <h6>{t.fitness.steps}</h6>
                <p className="text-caption text-[var(--color-mid-dark)]">{t.fitness.stepsGoal}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSteps(Math.max(0, steps - 100))}><Minus size={16} /></Button>
            <p className="text-h5">{steps.toLocaleString()}</p>
            <Button variant="outline" onClick={() => setSteps(steps + 100)}><Plus size={16} /></Button>
          </div>
        </Card>

        {/* Sleep */}
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Moon size={24} className="text-purple-500" />
              </div>
              <div>
                <h6>{t.dashboard.sleep}</h6>
                <p className="text-caption text-[var(--color-mid-dark)]">8 {t.analytics.hours}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSleep(Math.max(0, sleep - 0.5))}><Minus size={16} /></Button>
            <p className="text-h5">{sleep} {t.analytics.hours}</p>
            <Button variant="outline" onClick={() => setSleep(Math.min(12, sleep + 0.5))}><Plus size={16} /></Button>
          </div>
        </Card>

        {/* Mindfulness */}
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Brain size={24} className="text-green-500" />
              </div>
              <div>
                <h6>{t.dashboard.mindfulness}</h6>
                <p className="text-caption text-[var(--color-mid-dark)]">15 {t.dashboard.min}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setMindfulness(Math.max(0, mindfulness - 5))}><Minus size={16} /></Button>
            <p className="text-h5">{mindfulness} {t.dashboard.min}</p>
            <Button variant="outline" onClick={() => setMindfulness(mindfulness + 5)}><Plus size={16} /></Button>
          </div>
        </Card>

        {/* Mood */}
        <Card>
          <div className="mb-4">
            <h6 className="mb-2">{t.dashboard.mood}</h6>
            <p className="text-caption text-[var(--color-mid-dark)]">{t.fitness.subtitle}</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${mood === m.value ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-lightest)] text-[var(--color-dark)]'
                  }`}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-caption">{m.label}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </MobileLayout>
  );
}
