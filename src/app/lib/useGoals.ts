/**
 * useGoals.ts
 * -----------
 * Tiny shared store for the user's goals. Loads once from
 * GET /api/users/me/goals, exposes a setter that PUTs back.
 * Detail screens (Steps/Water/Sleep/Mood) and GoalsScreen all use this.
 */

import { useEffect, useState } from 'react';
import { apiGet, apiPut } from './api';

export interface Goals {
  stepsGoal: number;
  waterGoal: number;
  sleepGoal: number;
  mindfulnessGoal: number;
}

const DEFAULTS: Goals = {
  stepsGoal: 10000,
  waterGoal: 8,
  sleepGoal: 8,
  mindfulnessGoal: 15
};

let cached: Goals | null = null;
const listeners = new Set<(g: Goals) => void>();

function notify(g: Goals) {
  cached = g;
  listeners.forEach(l => l(g));
}

/** Hook — returns [goals, save] tuple. Auto-loads once. */
export function useGoals(): [Goals, (patch: Partial<Goals>) => Promise<void>] {
  const [goals, setGoals] = useState<Goals>(cached || DEFAULTS);

  useEffect(() => {
    listeners.add(setGoals);
    if (!cached) {
      apiGet<{ goals: Goals }>('/api/users/me/goals')
        .then((r) => notify({ ...DEFAULTS, ...r.goals }))
        .catch(() => {});
    }
    return () => { listeners.delete(setGoals); };
  }, []);

  const save = async (patch: Partial<Goals>) => {
    const next = { ...(cached || DEFAULTS), ...patch };
    notify(next);
    try {
      await apiPut('/api/users/me/goals', patch);
    } catch (err) {
      console.error('Failed to save goals:', err);
    }
  };

  return [goals, save];
}
