import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileLayout } from '../components/MobileLayout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MeditationSession {
  id: number;
  title: string;
  duration: string;
  description: string;
  category: string;
  audioUrl: string;
}

export function MeditationSessionScreen() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const sessions: Record<number, MeditationSession> = {
    1: {
      id: 1,
      title: 'Focus Boost',
      duration: '3:00',
      description: 'Quick breathing exercise to enhance focus and clarity',
      category: 'Breathing',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    2: {
      id: 2,
      title: 'Instant Calm',
      duration: '3:00',
      description: 'Rapid relaxation through controlled breathing',
      category: 'Breathing',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    3: {
      id: 3,
      title: 'Calming Taps',
      duration: '4:00',
      description: 'Gentle tapping meditation for stress relief',
      category: 'Basic Meditation',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    4: {
      id: 4,
      title: 'Anxiety Relief',
      duration: '4:00',
      description: 'Soothing meditation to ease anxiety and worry',
      category: 'Basic Meditation',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
    5: {
      id: 5,
      title: 'Body Scan',
      duration: '4:00',
      description: 'Systematic body awareness and relaxation',
      category: 'Basic Meditation',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    6: {
      id: 6,
      title: 'Moving Focus',
      duration: '3:00',
      description: 'Train your attention through guided focus shifts',
      category: 'Attention Training',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    7: {
      id: 7,
      title: 'Active Listening',
      duration: '10:00',
      description: 'Develop deep listening skills and presence',
      category: 'Attention Training',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    }
  };

  const session = sessions[parseInt(sessionId || '1')];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });

      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });

      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  if (!session) {
    return (
      <MobileLayout showNav={false}>
        <div className="flex items-center justify-center h-screen">
          <p className="text-body1 text-[var(--color-mid-dark)]">{t.settings.sessionNotFound}</p>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <button onClick={() => navigate('/meditation')} className="p-2">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <p className="text-subtitle2 opacity-80 mb-2">{session.category}</p>
          <h4 className="mb-4 text-center">{session.title}</h4>
          <p className="text-body1 text-center opacity-90 mb-8 max-w-sm">
            {session.description}
          </p>

          {/* Animated Circle */}
          <div className="relative w-48 h-48 mb-12">
            <div className={`absolute inset-0 rounded-full bg-white/20 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
              <button
                onClick={togglePlayPause}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-110"
              >
                {isPlaying ? (
                  <Pause size={32} className="text-[var(--color-primary)]" />
                ) : (
                  <Play size={32} className="text-[var(--color-primary)] ml-1" />
                )}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-sm mb-4">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, white ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.3) ${(currentTime / (duration || 1)) * 100}%)`
              }}
            />
          </div>

          {/* Time Display */}
          <div className="flex justify-between w-full max-w-sm mb-8 text-subtitle2 opacity-80">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-8">
            <button
              onClick={skipBackward}
              className="p-3 hover:bg-white/10 rounded-full transition-colors"
            >
              <SkipBack size={28} />
            </button>
            <button
              onClick={skipForward}
              className="p-3 hover:bg-white/10 rounded-full transition-colors"
            >
              <SkipForward size={28} />
            </button>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={session.audioUrl} preload="metadata" />
      </div>
    </MobileLayout>
  );
}
