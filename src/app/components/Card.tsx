/**
 * Card.tsx
 * --------
 * Reusable rounded white card with shadow and subtle border. The default
 * container element across the app — used for stat tiles, list items,
 * recommendations, etc.
 *
 * Contains:
 *   - <Card /> presentational component
 */

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;          // anything to render inside the card
  className?: string;           // extra Tailwind classes appended to the defaults
  onClick?: () => void;         // optional — when provided the card becomes clickable
}

/**
 * Card
 * ----
 * Takes children, an optional className, and an optional onClick handler.
 * Returns a styled <div>. If onClick is provided, the card adopts cursor-pointer
 * and a hover shadow to communicate interactivity.
 */
export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-lighter)] ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
