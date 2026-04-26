import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ElanLogo } from '../components/ElanLogo';
import { Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { ensureStarted } from '../lib/stepCounter';

export function SignInScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    try {
      await signIn(formData.email.trim(), formData.password);
      await ensureStarted();
      navigate('/home');
    } catch (err: any) {
      const code = err?.code || '';
      let msg = err?.message || 'Sign-in failed';
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        msg = 'Email or password is incorrect.';
      }
      if (code === 'auth/invalid-email')      msg = 'That email address looks invalid.';
      if (code === 'auth/too-many-requests')  msg = 'Too many attempts. Please wait and try again.';
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
        <h4 className="mb-2 text-center">{t.signIn.title}</h4>
        <p className="text-body2 text-[var(--color-mid-dark)] text-center mb-8">{t.signIn.subtitle}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-subtitle2 text-[var(--color-dark)] block mb-2">{t.signIn.email}</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-full border border-[var(--color-light)] bg-white focus:outline-none focus:border-[var(--color-primary)] text-body2"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-subtitle2 text-[var(--color-dark)] block mb-2">{t.signIn.password}</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 pr-12 rounded-full border border-[var(--color-light)] bg-white focus:outline-none focus:border-[var(--color-primary)] text-body2"
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
          <div className="text-right">
            <button type="button" className="text-body2 text-[var(--color-primary)] hover:underline">
              {t.signIn.forgotPassword}
            </button>
          </div>

          {errorMessage && <p className="text-body2 text-red-600 text-center">{errorMessage}</p>}

          <Button fullWidth type="submit" className="mt-8" disabled={submitting}>
            {submitting ? '...' : t.signIn.signInButton}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-body2 text-[var(--color-mid-dark)]">
            {t.signIn.noAccount}{' '}
            <button onClick={() => navigate('/signup')} className="text-[var(--color-primary)] hover:underline">
              {t.signIn.signUpLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
