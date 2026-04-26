import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { ChevronLeft, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

export function SleepDetailScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const todayHours = 7.5;
  const goalHours = 8;

  const weekData = [
    { id: 'mon', day: t.fitness.mon, hours: 7.2, date: '20' },
    { id: 'tue', day: t.fitness.tue, hours: 8.1, date: '21' },
    { id: 'wed', day: t.fitness.wed, hours: 6.8, date: '22' },
    { id: 'thu', day: t.fitness.thu, hours: 8.3, date: '23' },
    { id: 'fri', day: t.fitness.fri, hours: 7.5, date: '24' },
    { id: 'sat', day: t.fitness.sat, hours: 6.2, date: '25' },
    { id: 'sun', day: t.fitness.sun, hours: 9.1, date: '26' }
  ];

  const avgHours = (weekData.reduce((sum, day) => sum + day.hours, 0) / weekData.length).toFixed(1);
  const totalHours = weekData.reduce((sum, day) => sum + day.hours, 0).toFixed(1);

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
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
            <Moon size={28} className="text-purple-500" />
          </div>
          <div>
            <h4 className="mb-1">{t.dashboard.sleep}</h4>
            <p className="text-body2 text-[var(--color-mid-dark)]">{t.analytics.activityTrends}</p>
          </div>
        </div>

        {/* Today's Sleep - Large Display */}
        <Card className="mb-6 bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <div className="text-center py-6">
            <p className="text-subtitle2 text-[var(--color-mid-dark)] mb-2">{t.fitness.today}</p>
            <h2 className="text-purple-600 mb-2">{todayHours}h</h2>
            <div className="w-full bg-[var(--color-lighter)] rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((todayHours / goalHours) * 100, 100)}%` }}
              />
            </div>
            <p className="text-caption text-[var(--color-mid-dark)]">
              {todayHours >= goalHours ? t.fitness.goalReached : `${(goalHours - todayHours).toFixed(1)}h ${t.fitness.toGoal}`}
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
                domain={[0, goalHours]}
                ticks={[0, goalHours / 4, goalHours / 2, (goalHours * 3) / 4, goalHours]}
              />
              <Bar dataKey="hours" radius={[8, 8, 0, 0]} barSize={32}>
                {weekData.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={entry.hours >= goalHours ? '#a855f7' : '#d8b4fe'}
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
              <Moon size={16} className="text-purple-500" />
              <p className="text-caption text-[var(--color-mid-dark)]">{t.fitness.average}</p>
            </div>
            <h5 className="text-[var(--color-darkest)]">{avgHours}h</h5>
            <p className="text-caption text-[var(--color-mid-dark)]">{t.analytics.perDay}</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Moon size={16} className="text-purple-500" />
              <p className="text-caption text-[var(--color-mid-dark)]">{t.fitness.total}</p>
            </div>
            <h5 className="text-[var(--color-darkest)]">{totalHours}h</h5>
            <p className="text-caption text-[var(--color-mid-dark)]">{t.fitness.thisWeek}</p>
          </Card>
        </div>
      </div>
    </MobileLayout>
  );
}
