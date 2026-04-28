/**
 * MeditationSessionScreen.tsx
 * ---------------------------
 * Full-screen video meditation player. 7 sessions in 3 categories:
 *   Breathing — Focus Boost (3m), Instant Calm (3m)
 *   Basic Meditation — Calming Taps (4m), Anxiety Relief (4m), Body Scan (4m)
 *   Attention Training — Moving Focus (3m), Active Listening (10m)
 *
 * Uses native <video> with controls. Tapping X exits to /meditation.
 */

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
  videoUrl: string;
}

// Public sample videos. Replace each src with the real meditation video URL
// when you have the assets. These are royalty-free placeholders that work
// out of the box for the demo.
const SAMPLE_VIDEO = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/CastVideos/mp4/DesigningForGoogleCast.mp4';

const sessions: Record<number, MeditationSession> = {
  1: { id: 1, title: 'Focus Boost', duration: '3:00', description: 'Quick breathing exercise to enhance focus and clarity', category: 'Breathing', videoUrl: SAMPLE_VIDEO },
  2: { id: 2, title: 'Instant Calm', duration: '3:00', description: 'Rapid relaxation through controlled breathing', category: 'Breathing', videoUrl: SAMPLE_VIDEO },
  3: { id: 3, title: 'Calming Taps', duration: '4:00', description: 'Gentle tapping meditation for stress relief', category: 'Basic Meditation', videoUrl: SAMPLE_VIDEO },
  4: { id: 4, title: 'Anxiety Relief', duration: '4:00', description: 'Soothing meditation to ease anxiety and worry', category: 'Basic Meditation', videoUrl: SAMPLE_VIDEO },
  5: { id: 5, title: 'Body Scan', duration: '4:00', description: 'Systematic body awareness and relaxation', category: 'Basic Meditation', videoUrl: SAMPLE_VIDEO },
  6: { id: 6, title: 'Moving Focus', duration: '3:00', description: 'Train your attention through guided focus shifts', category: 'Attention Training', videoUrl: SAMPLE_VIDEO },
  7: { id: 7, title: 'Active Listening', duration: '10:00', description: 'Develop deep listening skills and presence', category: 'Attention Training', videoUrl: SAMPLE_VIDEO }
};

export function MeditationSessionScreen() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const session = sessions[parseInt(sessionId || '1', 10)];

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
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Close button — overlays video, top-right */}
      <button
        onClick={() => navigate('/meditation')}
        className="absolute top-12 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
      >
        <X size={22} />
      </button>

      {/* Title strip — overlays video, top-left */}
      <div className="absolute top-12 left-4 z-10 max-w-[70%]">
        <p className="text-caption text-white/70">{session.category}</p>
        <h6 className="text-white">{session.title}</h6>
      </div>

      {/* Video — fills the screen */}
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
