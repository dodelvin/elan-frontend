import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Activity, Droplet, Moon, Brain, Plus, Minus } from 'lucide-react';
import { Button } from '../components/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { useGoals } from '../lib/useGoals';
import { useState } from 'react';

export function GoalsScreen() {
  const { t } = useLanguage();
  const [goals, saveGoals] = useGoals();
  const [savedFlash, setSavedFlash] = useState(false);

  // 1. Updated the function to accept the event 'e'
  const update = (e: React.MouseEvent, patch: Partial<typeof goals>) => {
    e.preventDefault();   // Prevents default browser actions (like form submission)
    e.stopPropagation();  // STOPS navigation/bubbling to parent elements
    
    saveGoals(patch);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1000);
  };

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        <div className="flex items-center justify-between mb-2">
          <h4>{t.nav.goals}</h4>
          {savedFlash && <span className="text-caption text-green-600">✓ Saved</span>}
        </div>
        <p className="text-body2 text-[var(--color-mid-dark)] mb-6">{t.goals.setWellnessTargets}</p>

        {/* Steps */}
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <Activity size={24} className="text-red-500" />
              </div>
              <div>
                <h6>{t.goals.steps}</h6>
                <p className="text-caption text-[var(--color-mid-dark)]">{t.goals.dailyTarget}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            {/* 2. Pass the event (e) into the update function */}
            <Button variant="outline" onClick={(e) => update(e, { stepsGoal: Math.max(1000, goals.stepsGoal - 1000) })}>
              <Minus size={16} />
            </Button>
            <p className="text-h5">{goals.stepsGoal.toLocaleString()}</p>
            <Button variant="outline" onClick={(e) => update(e, { stepsGoal: goals.stepsGoal + 1000 })}>
              <Plus size={16} />
            </Button>
          </div>
        </Card>

        {/* Water */}
        <Card className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Droplet size={24} className="text-blue-500" />
              </div>
              <div>
                <h6>{t.meals.waterIntake}</h6>
                <p className="text-caption text-[var(--color-mid-dark)]">{t.goals.glassesPerDay}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={(e) => update(e, { waterGoal: Math.max(1, goals.waterGoal - 1) })}>
              <Minus size={16} />
            </Button>
            <p className="text-h5">{goals.waterGoal} {t.dashboard.glasses}</p>
            <Button variant="outline" onClick={(e) => update(e, { waterGoal: goals.waterGoal + 1 })}>
              <Plus size={16} />
            </Button>
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
                <p className="text-caption text-[var(--color-mid-dark)]">{t.goals.hoursPerNight}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={(e) => update(e, { sleepGoal: Math.max(4, goals.sleepGoal - 0.5) })}>
              <Minus size={16} />
            </Button>
            <p className="text-h5">{goals.sleepGoal}h</p>
            <Button variant="outline" onClick={(e) => update(e, { sleepGoal: Math.min(12, goals.sleepGoal + 0.5) })}>
              <Plus size={16} />
            </Button>
          </div>
        </Card>

        {/* Mindfulness */}
        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Brain size={24} className="text-green-500" />
              </div>
              <div>
                <h6>{t.dashboard.mindfulness}</h6>
                <p className="text-caption text-[var(--color-mid-dark)]">{t.goals.minutesPerDay}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={(e) => update(e, { mindfulnessGoal: Math.max(5, goals.mindfulnessGoal - 5) })}>
              <Minus size={16} />
            </Button>
            <p className="text-h5">{goals.mindfulnessGoal} {t.dashboard.min}</p>
            <Button variant="outline" onClick={(e) => update(e, { mindfulnessGoal: goals.mindfulnessGoal + 5 })}>
              <Plus size={16} />
            </Button>
          </div>
        </Card>

        <p className="text-caption text-center text-[var(--color-mid-dark)]">{t.common.save}d automatically</p>
      </div>
    </MobileLayout>
  );
}