/**
 * MeditationSessionScreen.tsx
 * ---------------------------
 * Player. Fetches session details by :sessionId, logs session on
 * completion via POST /api/meditations/sessions.
 * Route: /meditation/:sessionId
 */

import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MobileLayout } from '../components/MobileLayout';
import { Play, Pause, SkipBack, SkipForward, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { apiGet, apiPost } from '../lib/api';

interface Session {
  id: string;
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

  const [session, setSession] = useState<Session | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Fetch session by id.
  useEffect(() => {
    if (!sessionId) return;
    apiGet<{ meditation: Session }>(`/api/meditations/${sessionId}`)
      .then((r) => setSession(r.meditation))
      .catch(() => setSession(null));
  }, [sessionId]);

  // Wire audio element listeners + log completion when audio ends.
  useEffect(() => {
    if (!audioRef.current) return;
    const a = audioRef.current;
    const onLoaded = () => setDuration(a.duration || 0);
    const onUpdate = () => setCurrentTime(a.currentTime || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      // Log the completed session — fire and forget.
      if (session?.id) {
        apiPost('/api/meditations/sessions', {
          meditationId: session.id,
          durationSeconds: Math.round(a.duration || 0)
        }).catch(() => {});
      }
    };
    a.addEventListener('loadedmetadata', onLoaded);
    a.addEventListener('timeupdate', onUpdate);
    a.addEventListener('ended', onEnded);
    return () => {
      a.removeEventListener('loadedmetadata', onLoaded);
      a.removeEventListener('timeupdate', onUpdate);
      a.removeEventListener('ended', onEnded);
    };
  }, [session]);

  /** Toggle play/pause. */
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  /** Skip forward 10 seconds. */
  const skipForward = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
  };

  /** Skip backward 10 seconds. */
  const skipBackward = () => {
    if (audioRef.current) audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 10, 0);
  };

  /** Format seconds as M:SS. */
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  /** Seek bar handler. */
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
        <div className="p-6 flex items-center justify-between">
          <button onClick={() => navigate('/meditation')} className="p-2"><X size={24} /></button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <p className="text-subtitle2 opacity-80 mb-2">{session.category}</p>
          <h4 className="mb-4 text-center">{session.title}</h4>
          <p className="text-body1 text-center opacity-90 mb-8 max-w-sm">{session.description}</p>

          <div className="relative w-48 h-48 mb-12">
            <div className={`absolute inset-0 rounded-full bg-white/20 flex items-center justify-center ${isPlaying ? 'animate-pulse' : ''}`}>
              <button
                onClick={togglePlayPause}
                className="w-20 h-20 rounded-full bg-white flex items-center justify-center transition-transform hover:scale-110"
              >
                {isPlaying
                  ? <Pause size={32} className="text-[var(--color-primary)]" />
                  : <Play size={32} className="text-[var(--color-primary)] ml-1" />}
              </button>
            </div>
          </div>

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

          <div className="flex justify-between w-full max-w-sm mb-8 text-subtitle2 opacity-80">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center gap-8">
            <button onClick={skipBackward} className="p-3 hover:bg-white/10 rounded-full transition-colors"><SkipBack size={28} /></button>
            <button onClick={skipForward} className="p-3 hover:bg-white/10 rounded-full transition-colors"><SkipForward size={28} /></button>
          </div>
        </div>

        <audio ref={audioRef} src={session.audioUrl} preload="metadata" />
      </div>
    </MobileLayout>
  );
}
