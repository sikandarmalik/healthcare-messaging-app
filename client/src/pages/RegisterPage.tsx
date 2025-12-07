import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n';
import LanguageToggle from '../components/LanguageToggle';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    hkid: '',
    dateOfBirth: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordMismatch'));
      return;
    }

    if (formData.password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      });
      navigate('/app');
    } catch (err: unknown) {
      if (err instanceof Error && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || t('registrationFailed'));
      } else {
        setError(t('registrationFailed'));
      }
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
        <div className="max-w-lg w-full">
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

          {/* Registration Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-100 p-8">
            <h2 className="text-xl font-semibold text-neutral-800 text-center mb-6">
              {t('signUpTitle')}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t('fullName')} *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-neutral-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-neutral-50 hover:bg-white transition-colors"
                    placeholder="陳大文 / Chan Tai Man"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t('email')} *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-neutral-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-neutral-50 hover:bg-white transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t('password')} *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-neutral-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-neutral-50 hover:bg-white transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t('confirmPassword')} *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-neutral-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-neutral-50 hover:bg-white transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="hkid" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t('hkid')}
                  </label>
                  <input
                    id="hkid"
                    name="hkid"
                    type="text"
                    value={formData.hkid}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-neutral-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-neutral-50 hover:bg-white transition-colors"
                    placeholder={t('hkidPlaceholder')}
                    pattern="[A-Z]{1,2}[0-9]{6}\([0-9A]\)"
                  />
                </div>

                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t('dateOfBirth')}
                  </label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-neutral-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-neutral-50 hover:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t('phone')}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-neutral-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-neutral-50 hover:bg-white transition-colors"
                    placeholder={t('phonePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-neutral-700 mb-1.5">
                    {t('address')}
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-neutral-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-neutral-50 hover:bg-white transition-colors"
                    placeholder={t('addressPlaceholder')}
                  />
                </div>
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
                    {t('creatingAccount')}
                  </>
                ) : (
                  t('signUp')
                )}
              </button>

              <p className="text-center text-sm text-neutral-600">
                {t('hasAccount')}{' '}
                <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-500">
                  {t('signInHere')}
                </Link>
              </p>
            </form>
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
