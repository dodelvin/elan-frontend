/**
 * OnboardingScreen.tsx
 * --------------------
 * Four-step paged introduction shown after Welcome. Each step is one
 * "feature pillar" of ÉLAN: set goals, track activity, sleep & rest,
 * community. Ends by navigating to /signup.
 *
 * Route: /onboarding
 *
 * Contains:
 *   - <OnboardingScreen />
 *   - handleNext()  advance step or finish onto sign-up
 *   - handleBack()  step back if not on the first slide
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ChevronRight, ChevronLeft, Target, Activity, Moon, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * OnboardingScreen
 * ----------------
 * No props. Holds a `currentStep` index in local state and renders one
 * step at a time. Skipping or finishing both navigate to /signup.
 */
export function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Variables related to the four onboarding slides
  // Each entry has an icon, translated title and description, and an accent color.
  const onboardingSteps = [
    {
      icon: Target,
      title: t.onboarding.step1Title,
      description: t.onboarding.step1Subtitle,
      color: 'var(--color-primary)'
    },
    {
      icon: Activity,
      title: t.onboarding.step2Title,
      description: t.onboarding.step2Subtitle,
      color: 'var(--color-mid-dark)'
    },
    {
      icon: Moon,
      title: t.onboarding.step3Title,
      description: t.onboarding.step3Subtitle,
      color: 'var(--color-dark)'
    },
    {
      icon: Heart,
      title: t.community.title,
      description: t.community.subtitle,
      color: 'var(--color-primary-light)'
    }
  ];

  /**
   * handleNext
   * Advances to the next step, or navigates to /signup on the final step.
   */
  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/signup');
    }
  };

  /**
   * handleBack
   * Steps back by one if we are not already on the first slide.
   */
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Convenience handles for the active step
  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen flex flex-col w-full max-w-[500px] sm:max-w-[430px] mx-auto bg-[var(--color-lightest)] p-6">
      {/* Skip button — jumps straight to sign-up */}
      <div className="flex justify-end mb-8">
        <button
          onClick={() => navigate('/signup')}
          className="text-body2 text-[var(--color-mid-dark)] hover:text-[var(--color-primary)]"
        >
          {t.common.skip}
        </button>
      </div>

      {/* Active slide content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center mb-12"
          style={{ backgroundColor: step.color + '15' }}
        >
          <Icon size={64} style={{ color: step.color }} strokeWidth={1.5} />
        </div>

        <h3 className="mb-6">{step.title}</h3>
        <p className="text-body1 text-[var(--color-dark)] max-w-sm">
          {step.description}
        </p>
      </div>

      {/* Step dots — active step is wider */}
      <div className="flex justify-center gap-2 mb-8">
        {onboardingSteps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${index === currentStep
                ? 'w-8 bg-[var(--color-primary)]'
                : 'w-2 bg-[var(--color-light)]'
              }`}
          />
        ))}
      </div>

      {/* Back + Next/Get Started buttons */}
      <div className="flex gap-4">
        {currentStep > 0 && (
          <Button variant="outline" onClick={handleBack}>
            <ChevronLeft size={20} />
          </Button>
        )}
        <Button fullWidth onClick={handleNext}>
          {currentStep === onboardingSteps.length - 1 ? t.onboarding.getStarted : t.common.next}
          {currentStep < onboardingSteps.length - 1 && <ChevronRight size={20} className="ml-2" />}
        </Button>
      </div>
    </div>
  );
}
