/**
 * AnalyticsScreen.tsx
 * -------------------
 * Weekly insights from GET /api/analytics/weekly. Charts come from the
 * 7-day metrics aggregation done server-side.
 * Route: /analytics
 */

import { useEffect, useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { ChevronLeft, TrendingUp, Award, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from 'recharts';
import { apiGet } from '../lib/api';

interface WeeklyResponse {
  kpis: { label: string; value: string; change: string; positive: boolean }[];
  weeklySteps: { day: string; steps: number }[];
  sleepData:   { day: string; hours: number }[];
  achievements: { title: string; description: string; color: string }[];
}

const ACH_ICONS = [Award, Target, TrendingUp];

export function AnalyticsScreen() {
  const navigate = useNavigate();
  const [data, setData] = useState<WeeklyResponse | null>(null);

  useEffect(() => {
    apiGet<WeeklyResponse>('/api/analytics/weekly').then(setData).catch(() => {});
  }, []);

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/home')} className="text-[var(--color-darkest)]">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h4>Health Insights</h4>
            <p className="text-caption text-[var(--color-mid-dark)]">Weekly Summary</p>
          </div>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(data?.kpis || []).map((stat) => (
            <Card key={stat.label}>
              <p className="text-caption text-[var(--color-mid-dark)] mb-1">{stat.label}</p>
              <h5 className="mb-2">{stat.value}</h5>
              <p className={`text-caption ${stat.positive ? 'text-green-600' : 'text-orange-600'}`}>
                {stat.change} vs last week
              </p>
            </Card>
          ))}
        </div>

        {/* Steps bar chart */}
        <Card className="mb-6">
          <h6 className="mb-4">Weekly Steps</h6>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data?.weeklySteps || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E1DF" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#988781" />
              <YAxis tick={{ fontSize: 12 }} stroke="#988781" />
              <Bar dataKey="steps" fill="#400101" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Sleep line chart */}
        <Card className="mb-6">
          <h6 className="mb-4">Sleep Patterns</h6>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data?.sleepData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E1DF" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#988781" />
              <YAxis tick={{ fontSize: 12 }} stroke="#988781" domain={[0, 10]} />
              <Line type="monotone" dataKey="hours" stroke="#7E6961" strokeWidth={3} dot={{ fill: '#400101', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Achievements */}
        <h6 className="mb-4">Recent Achievements</h6>
        <div className="space-y-3">
          {(data?.achievements || []).map((a, i) => {
            const Icon = ACH_ICONS[i] || Award;
            return (
              <Card key={a.title}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.color + '15' }}>
                    <Icon size={28} style={{ color: a.color }} />
                  </div>
                  <div>
                    <h6 className="mb-1">{a.title}</h6>
                    <p className="text-body2 text-[var(--color-mid-dark)]">{a.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </MobileLayout>
  );
}
