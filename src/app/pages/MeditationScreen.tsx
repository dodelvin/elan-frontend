import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Play, Clock, Pause } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function MeditationScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'breathing', label: 'Breathing' },
    { key: 'basic', label: 'Basic Meditation' },
    { key: 'attention', label: 'Attention Training' }
  ];

  const sessions = [
    // Breathing
    {
      id: 1,
      title: 'Focus Boost',
      duration: '3 min',
      description: 'Quick breathing exercise to enhance focus and clarity',
      category: 'breathing',
      categoryLabel: 'Breathing'
    },
    {
      id: 2,
      title: 'Instant Calm',
      duration: '3 min',
      description: 'Rapid relaxation through controlled breathing',
      category: 'breathing',
      categoryLabel: 'Breathing'
    },
    // Basic Meditation
    {
      id: 3,
      title: 'Calming Taps',
      duration: '4 min',
      description: 'Gentle tapping meditation for stress relief',
      category: 'basic',
      categoryLabel: 'Basic Meditation'
    },
    {
      id: 4,
      title: 'Anxiety Relief',
      duration: '4 min',
      description: 'Soothing meditation to ease anxiety and worry',
      category: 'basic',
      categoryLabel: 'Basic Meditation'
    },
    {
      id: 5,
      title: 'Body Scan',
      duration: '4 min',
      description: 'Systematic body awareness and relaxation',
      category: 'basic',
      categoryLabel: 'Basic Meditation'
    },
    // Attention Training
    {
      id: 6,
      title: 'Moving Focus',
      duration: '3 min',
      description: 'Train your attention through guided focus shifts',
      category: 'attention',
      categoryLabel: 'Attention Training'
    },
    {
      id: 7,
      title: 'Active Listening',
      duration: '10 min',
      description: 'Develop deep listening skills and presence',
      category: 'attention',
      categoryLabel: 'Attention Training'
    }
  ];

  const filteredSessions = selectedCategory === 'all'
    ? sessions
    : sessions.filter(session => session.category === selectedCategory);

  return (
    <MobileLayout>
      <div className="px-6 pt-12 pb-24">
        <h4 className="mb-2">{t.meditation.title}</h4>
        <p className="text-body2 text-[var(--color-mid-dark)] mb-6">
          {t.meditation.subtitle}
        </p>

        {/* Featured Session */}
        <Card className="mb-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white border-0">
          <div className="text-center py-8">
            <p className="text-subtitle2 opacity-80 mb-2">Featured</p>
            <h5 className="mb-4">Focus Boost</h5>
            <div className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-6 cursor-pointer hover:bg-white/30 transition-all" onClick={() => navigate('/meditation/1')}>
              <Play size={40} className="text-white ml-2" />
            </div>
            <div className="flex items-center justify-center gap-2 text-subtitle2">
              <Clock size={16} />
              <span>3 min</span>
            </div>
          </div>
        </Card>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-lighter)] text-[var(--color-darkest)]'
              }`}
            >
              <span className="text-caption">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Sessions */}
        <h6 className="mb-4">All Sessions</h6>
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
                      <p className="text-caption text-[var(--color-mid-dark)]">{session.categoryLabel}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[var(--color-lighter)] flex items-center justify-center">
                      <Play size={18} className="text-[var(--color-primary)] ml-1" />
                    </div>
                  </div>
                  <p className="text-body2 text-[var(--color-dark)] mb-2">{session.description}</p>
                  <div className="flex items-center gap-1 text-caption text-[var(--color-mid-dark)]">
                    <Clock size={12} />
                    <span>{session.duration}</span>
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