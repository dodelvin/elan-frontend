/**
 * ProfileScreen.tsx
 * -----------------
 * Profile + lifetime stats + badges. Data from GET /api/users/me.
 * Falls back to live Firebase user info while loading.
 * Route: /profile
 */

import { useEffect, useState } from 'react';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ChevronLeft, Camera, Award, TrendingUp, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiGet } from '../lib/api';

interface MeResponse {
  user: { uid: string; name: string; email: string; memberSince?: string; avatarLetter?: string };
  stats: { achievements: number; currentStreak: number; goalsMet: number };
  lifetime: { totalSteps: number; workoutsCompleted: number; meditationMinutes: number; sleepAverage: number };
  badges: { name: string; emoji: string; earned: boolean }[];
}

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState<MeResponse | null>(null);

  useEffect(() => {
    apiGet<MeResponse>('/api/users/me').then(setData).catch(() => {});
  }, []);

  // Variables related to display values (live Firebase user wins until backend responds)
  const displayName = data?.user.name || user?.displayName || user?.email?.split('@')[0] || 'User';
  const memberSince = data?.user.memberSince || 'Member since today';
  const avatarLetter = (data?.user.avatarLetter || displayName.charAt(0)).toUpperCase();

  // Variables related to the three top-level stat tiles
  const stats = [
    { icon: Award,      label: 'Achievements',   value: data?.stats.achievements ?? 0,                    color: '#400101' },
    { icon: TrendingUp, label: 'Current Streak', value: `${data?.stats.currentStreak ?? 0} days`,         color: '#7E6961' },
    { icon: Target,     label: 'Goals Met',      value: `${data?.stats.goalsMet ?? 0}%`,                  color: '#B2A5A0' }
  ];

  // Variables related to the lifetime activity grid
  const activities = [
    { label: 'Total Steps',         value: (data?.lifetime.totalSteps ?? 0).toLocaleString() },
    { label: 'Workouts Completed',  value: String(data?.lifetime.workoutsCompleted ?? 0)      },
    { label: 'Meditation Minutes',  value: String(data?.lifetime.meditationMinutes ?? 0)      },
    { label: 'Sleep Average',       value: `${data?.lifetime.sleepAverage ?? 0}h`             }
  ];

  const badges = data?.badges || [];

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/settings')} className="text-[var(--color-darkest)]">
            <ChevronLeft size={24} />
          </button>
          <h4>Profile</h4>
        </div>

        <Card className="mb-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-mid-dark)] flex items-center justify-center text-white mx-auto">
              <span className="text-[48px]">{avatarLetter}</span>
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white shadow-md">
              <Camera size={16} />
            </button>
          </div>
          <h5 className="mb-1">{displayName}</h5>
          <p className="text-body2 text-[var(--color-mid-dark)] mb-4">Member since {memberSince}</p>
          <div className="flex gap-2 justify-center">
            <Button size="small" onClick={() => alert('Edit Profile coming soon ✏️')}>Edit Profile</Button>
            <Button size="small" variant="outline" onClick={() => alert('Profile shared! 🎉')}>Share</Button>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="text-center py-4">
                <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
                  <Icon size={24} style={{ color: stat.color }} />
                </div>
                <p className="text-subtitle2 mb-1">{stat.value}</p>
                <p className="text-caption text-[var(--color-mid-dark)]">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        <h6 className="mb-4">Lifetime Activities</h6>
        <Card className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            {activities.map((activity) => (
              <div key={activity.label} className="text-center py-2">
                <p className="text-[34px]">{activity.value}</p>
                <p className="text-caption text-[var(--color-mid-dark)]">{activity.label}</p>
              </div>
            ))}
          </div>
        </Card>

        <h6 className="mb-4">Badges & Achievements</h6>
        <Card>
          <div className="grid grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.name}
                className={`text-center p-3 rounded-2xl transition-all cursor-pointer ${
                  badge.earned ? 'bg-[var(--color-lighter)] hover:shadow-md' : 'bg-[var(--color-lightest)] opacity-40'
                }`}
                onClick={() => badge.earned && alert(`${badge.emoji} ${badge.name}\n\nCongratulations on earning this!`)}
              >
                <div className="mb-2">{badge.emoji}</div>
                <p className="text-caption">{badge.name}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MobileLayout>
  );
}
