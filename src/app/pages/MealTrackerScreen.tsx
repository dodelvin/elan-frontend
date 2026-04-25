/**
 * MealTrackerScreen.tsx
 * ---------------------
 * Daily meal log. Fetches today's meals + macros from GET /api/meals.
 * Route: /meals
 */

import { useEffect, useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Coffee, Sun, Moon, Apple, Plus, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { apiGet } from '../lib/api';

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  items: string[];
}

interface MealsResponse {
  date: string;
  meals: Meal[];
  nutrition: {
    calories: { value: number; target: number };
    protein:  { value: number; target: number };
    carbs:    { value: number; target: number };
    fats:     { value: number; target: number };
  };
}

// Map slot id → icon (slots are stable: breakfast/lunch/dinner/snacks).
const SLOT_ICONS: Record<string, any> = {
  breakfast: Coffee,
  lunch:     Sun,
  dinner:    Moon,
  snacks:    Apple
};

export function MealTrackerScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [data, setData] = useState<MealsResponse | null>(null);

  useEffect(() => {
    apiGet<MealsResponse>('/api/meals').then(setData).catch(() => {});
  }, []);

  // Variables related to nutrition card derived from API response
  const nutritionStats = data ? [
    { label: t.meals.caloriesConsumed, value: `${data.nutrition.calories.value}`,    target: `${data.nutrition.calories.target}`,    color: '#400101' },
    { label: t.meals.protein,          value: `${data.nutrition.protein.value}g`,    target: `${data.nutrition.protein.target}g`,    color: '#7E6961' },
    { label: t.meals.carbs,            value: `${data.nutrition.carbs.value}g`,      target: `${data.nutrition.carbs.target}g`,      color: '#B2A5A0' },
    { label: t.meals.fats,             value: `${data.nutrition.fats.value}g`,       target: `${data.nutrition.fats.target}g`,       color: '#988781' }
  ] : [];

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/home')} className="text-[var(--color-darkest)]">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h4>{t.meals.title}</h4>
            <p className="text-caption text-[var(--color-mid-dark)]">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <h6 className="mb-4">{t.meals.todayNutrition}</h6>
          <div className="grid grid-cols-2 gap-4">
            {nutritionStats.map((stat) => (
              <div key={stat.label}>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-subtitle2">{stat.label}</span>
                  <span className="text-caption text-[var(--color-mid-dark)]">{stat.target}</span>
                </div>
                <div className="w-full h-2 bg-[var(--color-lighter)] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (parseInt(stat.value) / parseInt(stat.target)) * 100)}%`,
                      backgroundColor: stat.color
                    }}
                  />
                </div>
                <p className="text-subtitle2" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-3">
          {(data?.meals || []).map((meal) => {
            const Icon = SLOT_ICONS[meal.id] || Coffee;
            return (
              <Card key={meal.id} className="cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-lighter)' }}>
                      <Icon size={24} className="text-[var(--color-primary)]" />
                    </div>
                    <div className="flex-1">
                      <h6 className="mb-1">{meal.name}</h6>
                      <p className="text-caption text-[var(--color-mid-dark)]">{meal.time}</p>
                      {meal.items.length > 0 && (
                        <p className="text-body2 text-[var(--color-dark)] mt-1">{meal.items.join(', ')}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {meal.calories > 0
                      ? <p className="text-subtitle2 text-[var(--color-primary)]">{meal.calories} cal</p>
                      : <Plus size={24} className="text-[var(--color-mid-dark)]" />}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button fullWidth className="mt-6">
          <Plus size={20} className="mr-2" /> {t.meals.addMeal}
        </Button>
      </div>
    </MobileLayout>
  );
}
