import { useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { ChevronLeft, Droplet, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Button } from '../components/Button';

export function WaterDetailScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [todayGlasses, setTodayGlasses] = useState(6);
  const goalGlasses = 8;

  const weekData = [
    { id: 'mon', day: t.fitness.mon, glasses: 7, date: '20' },
    { id: 'tue', day: t.fitness.tue, glasses: 8, date: '21' },
    { id: 'wed', day: t.fitness.wed, glasses: 6, date: '22' },
    { id: 'thu', day: t.fitness.thu, glasses: 8, date: '23' },
    { id: 'fri', day: t.fitness.fri, glasses: 6, date: '24' },
    { id: 'sat', day: t.fitness.sat, glasses: 5, date: '25' },
    { id: 'sun', day: t.fitness.sun, glasses: 7, date: '26' }
  ];

  const avgGlasses = Math.round(weekData.reduce((sum, day) => sum + day.glasses, 0) / weekData.length);
  const totalGlasses = weekData.reduce((sum, day) => sum + day.glasses, 0);

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
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <Droplet size={28} className="text-blue-500" />
          </div>
          <div>
            <h4 className="mb-1">{t.meals.waterIntake}</h4>
            <p className="text-body2 text-[var(--color-mid-dark)]">{t.analytics.activityTrends}</p>
          </div>
        </div>

        {/* Today's Water - Large Display */}
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="text-center py-6">
            <p className="text-subtitle2 text-[var(--color-mid-dark)] mb-2">{t.fitness.today}</p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => setTodayGlasses(Math.max(0, todayGlasses - 1))}
                className="w-12 h-12 rounded-full p-0 flex items-center justify-center"
              >
                <Minus size={20} />
              </Button>
              <h2 className="text-blue-600">{todayGlasses}</h2>
              <Button
                onClick={() => setTodayGlasses(todayGlasses + 1)}
                className="w-12 h-12 rounded-full p-0 flex items-center justify-center bg-blue-500 hover:bg-blue-600"
              >
                <Plus size={20} className="text-white" />
              </Button>
            </div>
            <div className="w-full bg-[var(--color-lighter)] rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((todayGlasses / goalGlasses) * 100, 100)}%` }}
              />
            </div>
            <p className="text-caption text-[var(--color-mid-dark)]">
              {todayGlasses >= goalGlasses ? t.fitness.goalReached : `${goalGlasses - todayGlasses} ${t.fitness.toGoal}`}
            </p>
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
                domain={[0, goalGlasses]}
                ticks={[0, goalGlasses / 4, goalGlasses / 2, (goalGlasses * 3) / 4, goalGlasses]}
              />
              <Bar dataKey="glasses" radius={[8, 8, 0, 0]} barSize={32}>
                {weekData.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={entry.glasses >= goalGlasses ? '#3b82f6' : '#93c5fd'}
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

        {/* Statistics */}
        <h6 className="mb-4">{t.fitness.statistics}</h6>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplet size={16} className="text-blue-500" />
              <p className="text-caption text-[var(--color-mid-dark)]">{t.fitness.average}</p>
            </div>
            <h5 className="text-[var(--color-darkest)]">{avgGlasses}</h5>
            <p className="text-caption text-[var(--color-mid-dark)]">{t.dashboard.glasses}/{t.analytics.perDay}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplet size={16} className="text-blue-500" />
              <p className="text-caption text-[var(--color-mid-dark)]">{t.fitness.total}</p>
            </div>
            <h5 className="text-[var(--color-darkest)]">{totalGlasses}</h5>
            <p className="text-caption text-[var(--color-mid-dark)]">{t.dashboard.glasses} {t.fitness.thisWeek}</p>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}
