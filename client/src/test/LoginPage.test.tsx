import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../i18n';
import LoginPage from '../pages/LoginPage';

// Mock the API client
vi.mock('../api/client', () => ({
  apiClient: {
    getToken: vi.fn(() => null),
    setToken: vi.fn(),
    login: vi.fn(),
    getMe: vi.fn(),
  },
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset language to English for consistent tests
    localStorage.setItem('language', 'en');
  });

  it('renders login form', () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows link to register page', () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/register here/i)).toBeInTheDocument();
  });

  it('shows demo credentials', () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/demo credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/dr.smith@healthcare.com/i)).toBeInTheDocument();
  });
});
