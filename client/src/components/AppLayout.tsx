import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n';
import LanguageToggle from './LanguageToggle';

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { t } = useLanguage();

  const getUserName = () => {
    if (user?.profile) {
      return 'fullName' in user.profile ? user.profile.fullName : user.email;
    }
    return user?.email || 'User';
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'DOCTOR':
        return 'bg-teal-100 text-teal-800';
      case 'PATIENT':
        return 'bg-cyan-100 text-cyan-800';
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'DOCTOR':
        return t('roleDoctor');
      case 'PATIENT':
        return t('rolePatient');
      case 'ADMIN':
        return t('roleAdmin');
      default:
        return user?.role;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-neutral-100 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-2 ml-2 md:ml-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {t('appName')}
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle className="hidden sm:flex" />
              <div className="hidden md:flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center border-2 border-teal-200">
                  <span className="text-teal-700 font-semibold text-sm">
                    {getUserName().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-neutral-800">{getUserName()}</p>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadge()}`}
                  >
                    {getRoleLabel()}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title={t('logout')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)}>
          <div className="bg-white w-72 h-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-neutral-100 bg-gradient-to-r from-teal-50 to-cyan-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center border-2 border-teal-200">
                  <span className="text-teal-700 font-semibold text-lg">
                    {getUserName().charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-neutral-800">{getUserName()}</p>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getRoleBadge()}`}
                  >
                    {getRoleLabel()}
                  </span>
                </div>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              <button
                onClick={() => {
                  navigate('/app/conversations');
                  setShowMobileMenu(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  location.pathname.includes('/conversations')
                    ? 'bg-teal-50 text-teal-700 font-medium'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {t('conversations')}
              </button>
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-100">
              <LanguageToggle className="w-full justify-center" />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:w-64 bg-white border-r border-neutral-100">
          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => navigate('/app/conversations')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                location.pathname.includes('/conversations')
                  ? 'bg-teal-50 text-teal-700 font-medium'
                  : 'text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {t('conversations')}
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
