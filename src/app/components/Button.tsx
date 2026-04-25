/**
 * Button.tsx
 * ----------
 * Reusable button component with four visual variants and three sizes.
 * Forwards any standard <button> attributes (onClick, type, disabled, etc.).
 *
 * Contains:
 *   - <Button /> presentational component
 *
 * Variants:
 *   primary    filled, brand maroon — main call-to-action
 *   secondary  filled, mid-tone — supporting actions
 *   outline    bordered, transparent — secondary CTAs
 *   ghost      text only — tertiary / inline actions
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;                                       // button label / contents
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';   // visual style, default 'primary'
  size?: 'small' | 'medium' | 'large';                       // height + padding, default 'medium'
  fullWidth?: boolean;                                       // stretch to fill parent width
}

/**
 * Button
 * ------
 * Takes children, optional variant/size/fullWidth, plus any native button
 * props via ...rest. Composes Tailwind classes from the variant/size lookup
 * tables and returns a <button>.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  // Variables related to class composition
  const baseStyles = 'rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  // Per-variant color classes (all reference CSS variables in globals.css)
  const variants = {
    primary: 'bg-[var(--color-primary)] text-[var(--color-lightest)] hover:bg-[var(--color-primary-light)] active:bg-[var(--color-primary-dark)]',
    secondary: 'bg-[var(--color-mid)] text-[var(--color-lightest)] hover:bg-[var(--color-mid-dark)] active:bg-[var(--color-dark)]',
    outline: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-primary)] hover:text-[var(--color-lightest)]',
    ghost: 'text-[var(--color-primary)] bg-transparent hover:bg-[var(--color-lighter)]'
  };

  // Per-size padding + font scale
  const sizes = {
    small: 'px-4 py-2 text-[12px]',
    medium: 'px-6 py-3 text-button',
    large: 'px-8 py-4 text-button'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
