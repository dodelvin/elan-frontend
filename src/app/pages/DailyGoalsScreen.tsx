import { useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { ChevronLeft, Plus, CheckCircle, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/Button';

interface Goal {
  id: number;
  title: string;
  completed: boolean;
}

export function DailyGoalsScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [goals, setGoals] = useState<Goal[]>([
    { id: 1, title: t.dashboard.morningYoga, completed: true },
    { id: 2, title: t.dashboard.logWater, completed: false },
    { id: 3, title: t.dashboard.startWorkout, completed: false },
    { id: 4, title: t.dashboard.logMeal, completed: false }
  ]);
  const [showInput, setShowInput] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');

  const toggleGoal = (id: number) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const addGoal = () => {
    if (newGoalTitle.trim()) {
      setGoals([...goals, {
        id: Date.now(),
        title: newGoalTitle,
        completed: false
      }]);
      setNewGoalTitle('');
      setShowInput(false);
    }
  };

  const completedCount = goals.filter(g => g.completed).length;

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
        <div className="mb-6">
          <h4 className="mb-2">{t.dashboard.dailyGoals}</h4>
          <p className="text-body2 text-[var(--color-mid-dark)]">
            {completedCount} of {goals.length} {t.workouts.completed.toLowerCase()}
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <div className="w-full bg-[var(--color-lighter)] rounded-full h-3">
            <div
              className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-light)] h-3 rounded-full transition-all"
              style={{ width: `${goals.length > 0 ? (completedCount / goals.length) * 100 : 0}%` }}
            />
          </div>
        </Card>

        {/* Goals List */}
        <Card>
          <div className="space-y-1">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className="w-full flex items-center gap-3 py-4 px-4 hover:bg-[var(--color-lightest)] transition-colors rounded-xl"
              >
                <div className="flex-shrink-0">
                  {goal.completed ? (
                    <CheckCircle size={24} className="text-[var(--color-primary)]" />
                  ) : (
                    <Circle size={24} className="text-[var(--color-mid-dark)]" />
                  )}
                </div>
                <p
                  className={`flex-1 text-left text-body2 transition-all ${
                    goal.completed
                      ? 'line-through text-[var(--color-mid-dark)]'
                      : 'text-[var(--color-darkest)]'
                  }`}
                >
                  {goal.title}
                </p>
              </button>
            ))}

            {/* Add Goal Input */}
            {showInput && (
              <div className="flex items-center gap-3 py-4 px-4">
                <Circle size={24} className="text-[var(--color-mid-dark)] flex-shrink-0" />
                <input
                  type="text"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  placeholder="Enter goal..."
                  className="flex-1 text-body2 bg-transparent border-none outline-none"
                  autoFocus
                />
                <Button onClick={addGoal} size="sm">
                  {t.common.save}
                </Button>
              </div>
            )}

            {/* Add Goal Button */}
            <button
              onClick={() => setShowInput(true)}
              className="w-full flex items-center gap-3 py-4 px-4 text-[var(--color-primary)] hover:bg-[var(--color-lightest)] transition-colors rounded-xl"
            >
              <Plus size={24} />
              <p className="text-body2">{t.fitness.addGoal}</p>
            </button>
          </div>
        </Card>
      </div>
    </MobileLayout>
  );
}
