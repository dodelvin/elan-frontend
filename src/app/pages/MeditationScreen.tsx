/**
 * MeditationScreen.tsx
 * --------------------
 * Meditation library. Fetches catalog from GET /api/meditations.
 * Route: /meditation
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Play, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { apiGet } from '../lib/api';

interface Meditation {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  audioUrl?: string;
}

export function MeditationScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [sessions, setSessions] = useState<Meditation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    apiGet<{ meditations: Meditation[] }>('/api/meditations').then((r) => setSessions(r.meditations)).catch(() => {});
  }, []);

  // Variables related to category filter chips
  const categories = [
    { key: 'all',         label: t.meditation.categories.all         },
    { key: 'mindfulness', label: t.meditation.categories.mindfulness },
    { key: 'breathing',   label: t.meditation.categories.breathing   },
    { key: 'relaxation',  label: t.meditation.categories.relaxation  },
    { key: 'sleep',       label: t.meditation.categories.sleep       }
  ];

  const filteredSessions = selectedCategory === 'all'
    ? sessions
    : sessions.filter((s) => s.category.toLowerCase() === selectedCategory);

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        <h4 className="mb-2">{t.meditation.title}</h4>
        <p className="text-body2 text-[var(--color-mid-dark)] mb-6">{t.meditation.subtitle}</p>

        {/* Continue session hero */}
        <Card className="mb-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white border-0">
          <div className="text-center py-8">
            <p className="text-subtitle2 opacity-80 mb-2">{t.meditation.continueSession}</p>
            <h5 className="mb-4">{t.meditation.morningAwakening}</h5>
            <div
              className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-6 cursor-pointer hover:bg-white/30 transition-all"
              onClick={() => navigate('/meditation/1')}
            >
              <Play size={40} className="text-white ml-2" />
            </div>
            <div className="flex items-center justify-center gap-2 text-subtitle2">
              <Clock size={16} /> <span>3:45 / 10:00</span>
            </div>
          </div>
        </Card>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.key ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-lighter)] text-[var(--color-darkest)]'
              }`}
            >
              <span className="text-caption">{cat.label}</span>
            </button>
          ))}
        </div>

        <h6 className="mb-4">{t.meditation.guidedSessions}</h6>
        <div className="space-y-3">
          {filteredSessions.map((session) => (
            <Card
              key={session.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/meditation/${session.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h6 className="mb-1">{session.title}</h6>
                      <p className="text-caption text-[var(--color-mid-dark)]">{session.category}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[var(--color-lighter)] flex items-center justify-center">
                      <Play size={18} className="text-[var(--color-primary)] ml-1" />
                    </div>
                  </div>
                  <p className="text-body2 text-[var(--color-dark)] mb-2">{session.description}</p>
                  <div className="flex items-center gap-1 text-caption text-[var(--color-mid-dark)]">
                    <Clock size={12} /> <span>{session.duration}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
