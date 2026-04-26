import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Activity, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { apiGet } from '../lib/api';
import { subscribeToSteps } from '../lib/stepCounter';

type WeekDay = { id: string; day: string; steps: number; date: string };

export function StepsDetailScreen() {
  const navigate = useNavigate();

  // Live step counter from device motion (subscribes once on mount)
  const [liveSteps, setLiveSteps] = useState(0);
  useEffect(() => subscribeToSteps(setLiveSteps), []);

  // Weekly chart data fetched from backend
  const [weekData, setWeekData] = useState<WeekDay[]>([]);

  useEffect(() => {
    apiGet<{ weeklySteps: { day: string; steps: number }[] }>('/api/analytics/weekly')
      .then((r) => {
        const today = new Date();
        const mapped = r.weeklySteps.map((d, i) => {
          const dayDate = new Date(today);
          dayDate.setDate(today.getDate() - (6 - i));
          return {
            id: d.day.toLowerCase(),
            day: d.day,
            steps: d.steps,
            date: String(dayDate.getDate())
          };
        });
        setWeekData(mapped);
      })
      .catch(() => {});
  }, []);

  // Derived stats — guard against empty array during initial load
  const goalSteps = 10000;
  const currentSteps = liveSteps || weekData[weekData.length - 1]?.steps || 0;
  const avgSteps = weekData.length
    ? Math.round(weekData.reduce((sum, d) => sum + d.steps, 0) / weekData.length)
    : 0;
  const totalSteps = weekData.reduce((sum, d) => sum + d.steps, 0);
  const bestDay = weekData.length
    ? weekData.reduce((a, b) => (a.steps > b.steps ? a : b))
    : { steps: 0, day: '-' };
  const goalDays = weekData.filter((d) => d.steps >= goalSteps).length;
  const goalRate = weekData.length ? Math.round((goalDays / weekData.length) * 100) : 0;

  return (
    <MobileLayout showNav={false}>
      <div className="px-6 pt-12 pb-24">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 text-[var(--color-dark)] hover:text-[var(--color-darkest)]"
        >
          <ChevronLeft size={20} />
          <span className="text-body1">Back</span>
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
            <Activity size={28} className="text-red-500" />
          </div>
          <div>
            <h4 className="mb-1">Steps</h4>
            <p className="text-body2 text-[var(--color-mid-dark)]">Activity Trends</p>
          </div>
        </div>

        {/* Today's live count */}
        <Card className="mb-6 bg-gradient-to-br from-red-50 to-white border-red-100">
          <div className="text-center py-6">
            <p className="text-subtitle2 text-[var(--color-mid-dark)] mb-2">Today</p>
            <h2 className="text-[var(--color-primary)] mb-2">{currentSteps.toLocaleString()}</h2>
            <div className="w-full bg-[var(--color-lighter)] rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-red-500 to-red-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((currentSteps / goalSteps) * 100, 100)}%` }}
              />
            </div>
            <p className="text-caption text-[var(--color-mid-dark)]">
              {currentSteps >= goalSteps
                ? 'Goal reached!'
                : `${(goalSteps - currentSteps).toLocaleString()} to goal`}
            </p>
          </div>
        </Card>

        {/* Week chart */}
        <h6 className="mb-4">This Week</h6>
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
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Bar dataKey="steps" radius={[8, 8, 0, 0]} barSize={32}>
                {weekData.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={entry.steps >= goalSteps ? '#ef4444' : '#fca5a5'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div className="flex justify-between mt-2 px-2">
            {weekData.map((day) => (
              <div key={`date-${day.id}`} className="flex flex-col items-center" style={{ width: '14%' }}>
                <p className="text-caption text-[var(--color-mid-dark)]">{day.date}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Statistics */}
        <h6 className="mb-4">Statistics</h6>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-[var(--color-primary)]" />
              <p className="text-caption text-[var(--color-mid-dark)]">Average</p>
            </div>
            <h5 className="text-[var(--color-darkest)]">{avgSteps.toLocaleString()}</h5>
            <p className="text-caption text-[var(--color-mid-dark)]">per day</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={16} className="text-[var(--color-primary)]" />
              <p className="text-caption text-[var(--color-mid-dark)]">Total</p>
            </div>
            <h5 className="text-[var(--color-darkest)]">{totalSteps.toLocaleString()}</h5>
            <p className="text-caption text-[var(--color-mid-dark)]">This week</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award size={16} className="text-[var(--color-primary)]" />
              <p className="text-caption text-[var(--color-mid-dark)]">Best Day</p>
            </div>
            <h5 className="text-[var(--color-darkest)]">{bestDay.steps.toLocaleString()}</h5>
            <p className="text-caption text-[var(--color-mid-dark)]">{bestDay.day}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-green-600" />
              <p className="text-caption text-[var(--color-mid-dark)]">Goal Rate</p>
            </div>
            <h5 className="text-[var(--color-darkest)]">{goalRate}%</h5>
            <p className="text-caption text-[var(--color-mid-dark)]">{goalDays} of {weekData.length} days</p>
          </Card>
        </div>

        {/* Achievements */}
        <h6 className="mb-4">Recent Achievements</h6>
        <Card>
          <div className="flex items-center gap-3 py-3 border-b border-[var(--color-lighter)] last:border-0">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Award size={24} className="text-yellow-600" />
            </div>
            <div className="flex-1">
              <h6 className="mb-1">10k Champion</h6>
              <p className="text-caption text-[var(--color-mid-dark)]">Reached 10,000 steps</p>
            </div>
            <p className="text-caption text-[var(--color-mid-dark)]">Today</p>
          </div>

          <div className="flex items-center gap-3 py-3">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <h6 className="mb-1">Weekly Warrior</h6>
              <p className="text-caption text-[var(--color-mid-dark)]">Hit goal 4 days</p>
            </div>
            <p className="text-caption text-[var(--color-mid-dark)]">This week</p>
          </div>
        </Card>
      </div>
    </MobileLayout>
  );
}