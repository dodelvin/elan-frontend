/**
 * SignUpScreen.tsx
 * ----------------
 * Account creation form: full name, email, password (with show/hide toggle).
 * On submit, calls AuthContext.signUp() which:
 *   1. Creates the Firebase Auth user
 *   2. Sets the display name
 *   3. POSTs to /api/auth/signup so the backend creates the matching
 *      Firestore profile doc
 * On success, navigates to /home. On failure, shows an inline error.
 *
 * Route: /signup
 * Implements user story US5 (Authentication).
 *
 * Contains:
 *   - <SignUpScreen />
 *   - handleSubmit()  form submit handler — calls signUp(), routes to /home
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ElanLogo } from '../components/ElanLogo';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * SignUpScreen
 * ------------
 * No props. Adds form-error + submitting state on top of the original
 * form-data + visibility-toggle state.
 */
export function SignUpScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signUp } = useAuth();

  // Variables related to local form state
  const [showPassword, setShowPassword] = useState(false);     // password visibility toggle
  const [submitting, setSubmitting] = useState(false);         // disables the button while the request runs
  const [errorMessage, setErrorMessage] = useState<string | null>(null);  // human-readable error (if any)
  const [formData, setFormData] = useState({                   // controlled form values
    name: '',
    email: '',
    password: ''
  });

  /**
   * handleSubmit
   * Takes the form submit event. Prevents default, calls signUp() with
   * the three field values, and on success navigates to /home. On
   * failure, sets an error message and re-enables the button.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    try {
      await signUp(formData.name.trim(), formData.email.trim(), formData.password);
      navigate('/home');
    } catch (err: any) {
      // Firebase errors carry a `.code` like 'auth/email-already-in-use'.
      // Surface a friendly message keyed off the most common ones.
      const code = err?.code || '';
      let msg = err?.message || 'Sign-up failed';
      if (code === 'auth/email-already-in-use') msg = 'That email is already registered. Try signing in.';
      if (code === 'auth/weak-password') msg = 'Password should be at least 6 characters.';
      if (code === 'auth/invalid-email') msg = 'That email address looks invalid.';
      setErrorMessage(msg);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col w-full max-w-[500px] sm:max-w-[430px] mx-auto bg-[var(--color-lightest)] p-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-12 text-center">
          <ElanLogo size="small" variant="dark" />
        </div>

        <h4 className="mb-2 text-center">{t.signUp.title}</h4>
        <p className="text-body2 text-[var(--color-mid-dark)] text-center mb-8">
          {t.signUp.subtitle}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full name */}
          <div>
            <label className="text-subtitle2 text-[var(--color-dark)] block mb-2">
              {t.signUp.name}
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-full border border-[var(--color-light)] bg-white focus:outline-none focus:border-[var(--color-primary)] transition-colors text-body2"
              placeholder=""
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-subtitle2 text-[var(--color-dark)] block mb-2">
              {t.signUp.email}
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-full border border-[var(--color-light)] bg-white focus:outline-none focus:border-[var(--color-primary)] transition-colors text-body2"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password with show/hide eye toggle */}
          <div>
            <label className="text-subtitle2 text-[var(--color-dark)] block mb-2">
              {t.signUp.password}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 rounded-full border border-[var(--color-light)] bg-white focus:outline-none focus:border-[var(--color-primary)] transition-colors text-body2"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-mid-dark)]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Inline error — only rendered when a request failed */}
          {errorMessage && (
            <p className="text-body2 text-red-600 text-center">{errorMessage}</p>
          )}

          <Button fullWidth type="submit" className="mt-8" disabled={submitting}>
            {submitting ? '...' : t.signUp.signUpButton}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-body2 text-[var(--color-mid-dark)]">
            {t.signUp.haveAccount}{' '}
            <button
              onClick={() => navigate('/signin')}
              className="text-[var(--color-primary)] hover:underline"
            >
              {t.signUp.signInLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
