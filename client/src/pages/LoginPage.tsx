import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      setError(t('invalidCredentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col healthcare-gradient">
      {/* Header with Language Toggle */}
      <div className="w-full px-4 py-4 flex justify-end">
        <LanguageToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-md w-full">
          {/* Logo and Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-healthcare-lg mb-4">
              <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              {t('appName')}
            </h1>
            <p className="mt-2 text-sm text-neutral-500">{t('appTagline')}</p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-8">
            <h2 className="text-xl font-semibold text-neutral-800 text-center mb-6">
              {t('signInTitle')}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  {t('email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-4 py-3 border border-neutral-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-neutral-50 hover:bg-white transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1.5">
                  {t('password')}
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-4 py-3 border border-neutral-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-neutral-50 hover:bg-white transition-colors"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-healthcare text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('signingIn')}
                  </>
                ) : (
                  t('signIn')
                )}
              </button>

              <p className="text-center text-sm text-neutral-600">
                {t('noAccount')}{' '}
                <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-500">
                  {t('registerHere')}
                </Link>
              </p>
            </form>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl border border-neutral-200 p-4">
            <p className="text-center text-sm font-medium text-neutral-600 mb-3">{t('demoCredentials')}</p>
            <div className="text-xs text-neutral-500 space-y-1.5">
              <div className="flex items-center justify-center gap-2">
                <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full font-medium">{t('doctor')}</span>
                <span>dr.smith@healthcare.com / password123</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded-full font-medium">{t('patient')}</span>
                <span>patient1@example.com / password123</span>
              </div>
            </div>
          </div>

          {/* Hong Kong specific footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-neutral-400">{t('hospitalAuthority')}</p>
            <div className="mt-2 flex items-center justify-center gap-4 text-xs text-neutral-400">
              <a href="#" className="hover:text-teal-600">{t('privacyPolicy')}</a>
              <span>•</span>
              <a href="#" className="hover:text-teal-600">{t('termsOfService')}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
