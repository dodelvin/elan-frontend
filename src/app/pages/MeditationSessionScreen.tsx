/**
 * MeditationSessionScreen.tsx
 * ---------------------------
 * Two modes:
 *   - Breathing sessions (1, 2): full-screen animated circle that pulses
 *     in sync with a 4-4-4-4 box breathing rhythm. Ambient audio loops
 *     in the background.
 *   - Other sessions (3-7): full-screen video player.
 *
 * Auto-detects which mode based on the session's category.
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X } from 'lucide-react';
import { MobileLayout } from '../components/MobileLayout';
import { useLanguage } from '../contexts/LanguageContext';

interface MeditationSession {
  id: number;
  title: string;
  duration: string;
  description: string;
  category: string;
  videoUrl?: string;
}

// Replace these with your actual Firebase Storage URLs when ready.
const SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/DesigningForGoogleCast.mp4';

// Ambient track for breathing sessions. Replace with a calmer track later.
const AMBIENT_AUDIO = 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_1718e49cdb.mp3';

const sessions: Record<number, MeditationSession> = {
  1: { id: 1, title: 'Focus Boost',     duration: '3:00',  description: 'Quick breathing exercise to enhance focus and clarity', category: 'Breathing' },
  2: { id: 2, title: 'Instant Calm',    duration: '3:00',  description: 'Rapid relaxation through controlled breathing',         category: 'Breathing' },
  3: { id: 3, title: 'Calming Taps',    duration: '4:00',  description: 'Gentle tapping meditation for stress relief',           category: 'Basic Meditation',   videoUrl: SAMPLE_VIDEO },
  4: { id: 4, title: 'Anxiety Relief',  duration: '4:00',  description: 'Soothing meditation to ease anxiety and worry',         category: 'Basic Meditation',   videoUrl: SAMPLE_VIDEO },
  5: { id: 5, title: 'Body Scan',       duration: '4:00',  description: 'Systematic body awareness and relaxation',              category: 'Basic Meditation',   videoUrl: SAMPLE_VIDEO },
  6: { id: 6, title: 'Moving Focus',    duration: '3:00',  description: 'Train your attention through guided focus shifts',      category: 'Attention Training', videoUrl: SAMPLE_VIDEO },
  7: { id: 7, title: 'Active Listening', duration: '10:00', description: 'Develop deep listening skills and presence',            category: 'Attention Training', videoUrl: SAMPLE_VIDEO }
};

// Box breathing: 4 seconds inhale, 4 hold, 4 exhale, 4 hold = 16s cycle
type Phase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out';
const PHASE_DURATION = 4000;

export function MeditationSessionScreen() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const session = sessions[parseInt(sessionId || '1', 10)];
  const isBreathing = session?.category === 'Breathing';

  const [phase, setPhase] = useState<Phase>('inhale');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Drive the breathing phase cycle for breathing sessions only.
  useEffect(() => {
    if (!isBreathing) return;
    const phases: Phase[] = ['inhale', 'hold-in', 'exhale', 'hold-out'];
    let i = 0;
    const tick = setInterval(() => {
      i = (i + 1) % phases.length;
      setPhase(phases[i]);
    }, PHASE_DURATION);
    return () => clearInterval(tick);
  }, [isBreathing]);

  // Start ambient audio on entry. iOS may block autoplay until user gesture.
  useEffect(() => {
    if (!isBreathing) return;
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {/* iOS will require tap */});
    }
  }, [isBreathing]);

  if (!session) {
    return (
      <MobileLayout showNav={false}>
        <div className="flex items-center justify-center h-screen">
          <p className="text-body1 text-[var(--color-mid-dark)]">{t.settings.sessionNotFound}</p>
        </div>
      </MobileLayout>
    );
  }

  // Variables related to the breathing animation
  const phaseLabel: Record<Phase, string> = {
    'inhale':   'Breathe in',
    'hold-in':  'Hold',
    'exhale':   'Breathe out',
    'hold-out': 'Hold'
  };

  // Circle scale per phase. Inhale grows, exhale shrinks, holds stay.
  const phaseScale: Record<Phase, number> = {
    'inhale':   1.4,
    'hold-in':  1.4,
    'exhale':   0.7,
    'hold-out': 0.7
  };

  // Tap once to bypass iOS audio block (some devices require an explicit tap)
  const handleScreenTap = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
  };

  // === BREATHING MODE ===
  if (isBreathing) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(circle at center, #5C0202 0%, #2A0000 100%)'
        }}
        onClick={handleScreenTap}
      >
        {/* Close button */}
        <button
          onClick={(e) => { e.stopPropagation(); navigate('/meditation'); }}
          className="absolute top-12 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <X size={22} />
        </button>

        {/* Title strip */}
        <div className="absolute top-12 left-4 z-10 max-w-[70%] text-white">
          <p className="text-caption opacity-70">{session.category}</p>
          <h6>{session.title}</h6>
        </div>

        {/* Animated breathing circle */}
        <div
          className="rounded-full"
          style={{
            width: '220px',
            height: '220px',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0.05))',
            boxShadow: '0 0 80px 20px rgba(255,255,255,0.15)',
            transform: `scale(${phaseScale[phase]})`,
            transition: `transform ${PHASE_DURATION}ms ease-in-out`
          }}
        />

        {/* Phase label */}
        <p
          className="text-white text-2xl mt-12 tracking-wide"
          style={{ opacity: 0.9 }}
        >
          {phaseLabel[phase]}
        </p>

        {/* Hint that fades after a few seconds */}
        <p className="text-white/40 text-caption mt-8 text-center px-8">
          Follow the circle. Inhale as it grows, exhale as it shrinks.
        </p>

        {/* Ambient audio loop */}
        <audio ref={audioRef} src={AMBIENT_AUDIO} loop preload="auto" />
      </div>
    );
  }

  // === VIDEO MODE ===
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <button
        onClick={() => navigate('/meditation')}
        className="absolute top-12 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        <X size={22} />
      </button>

      <div className="absolute top-12 left-4 z-10 max-w-[70%]">
        <p className="text-caption text-white/70">{session.category}</p>
        <h6 className="text-white">{session.title}</h6>
      </div>

      <video
        src={session.videoUrl}
        controls
        playsInline
        preload="metadata"
        className="w-full h-full object-contain bg-black"
      >
        Your browser does not support video playback.
      </video>
    </div>
  );
}