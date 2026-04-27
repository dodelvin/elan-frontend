/**
 * BackButton.tsx
 * --------------
 * Fixed-position back button for detail screens. Pinned to top of screen
 * with a translucent backdrop so content scrolls behind it without
 * looking ugly.
 *
 * Usage:
 *   <MobileLayout showNav={false}>
 *     <BackButton />
 *     <div className="px-6 pt-24 pb-24">...content...</div>
 *   </MobileLayout>
 *
 * The pt-24 on the content gives space for the fixed button to overlay.
 */

import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface BackButtonProps {
  to?: string;          // explicit destination; otherwise uses navigate(-1)
  rightSlot?: React.ReactNode;  // optional trailing element (e.g. "✓ Saved" indicator)
}

export function BackButton({ to, rightSlot }: BackButtonProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleClick = () => {
    if (to) navigate(to);
    else    navigate(-1);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-20 flex justify-center pointer-events-none">
      <div className="w-full max-w-[500px] sm:max-w-[430px] bg-[var(--color-lightest)]/95 backdrop-blur-sm pointer-events-auto px-6 pt-12 pb-4 flex items-center justify-between">
        <button
          onClick={handleClick}
          className="flex items-center gap-2 text-[var(--color-dark)] hover:text-[var(--color-darkest)] transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-body1">{t.common.back}</span>
        </button>
        {rightSlot}
      </div>
    </div>
  );
}
