/**
 * ElanLogo.tsx
 * ------------
 * Brand wordmark: italic "ÉLAN" with a small "WELLNESS" tagline below.
 * Used on the splash, welcome, and authentication screens.
 *
 * Contains:
 *   - <ElanLogo /> presentational component
 */

interface ElanLogoProps {
  size?: 'small' | 'default' | 'large';   // controls font size, default 'default'
  variant?: 'dark' | 'light';              // dark = brand maroon, light = off-white
}

/**
 * ElanLogo
 * --------
 * Takes optional size and variant props, returns the styled wordmark.
 * Maps the size prop to a Tailwind text-[Npx] class and the variant prop
 * to a CSS-variable color class.
 */
export function ElanLogo({ size = 'default', variant = 'dark' }: ElanLogoProps) {
  // Variables related to size/variant style lookups
  const sizes = {
    small: 'text-[24px]',
    default: 'text-[48px]',
    large: 'text-[96px]'
  };

  const colors = {
    dark: 'text-[var(--color-primary)]',
    light: 'text-[var(--color-lightest)]'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizes[size]} ${colors[variant]} tracking-[0.2em] italic`}>
        ÉLAN
      </div>
      <div className={`text-overline ${colors[variant]} tracking-[0.3em] mt-1 opacity-70`}>
        WELLNESS
      </div>
    </div>
  );
}
