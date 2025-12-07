import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../i18n';

// Mock the API client
vi.mock('../api/client', () => ({
  apiClient: {
    getToken: vi.fn(() => null),
    setToken: vi.fn(),
    login: vi.fn(),
    getMe: vi.fn(),
    getConversations: vi.fn(() => Promise.resolve([])),
  },
}));

describe('App routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset language to English for consistent tests
    localStorage.setItem('language', 'en');
  });

  it('redirects to login when not authenticated', async () => {
    render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );

    // Should show login page
    expect(await screen.findByText(/sign in to your account/i)).toBeInTheDocument();
  });

  it('shows login page at /login', async () => {
    window.history.pushState({}, '', '/login');
    
    render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(await screen.findByLabelText(/email address/i)).toBeInTheDocument();
  });

  it('shows register page at /register', async () => {
    window.history.pushState({}, '', '/register');
    
    render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );

    expect(await screen.findByText(/create your patient account/i)).toBeInTheDocument();
  });
});
